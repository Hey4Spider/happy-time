<template>
    <ElContainer class="app-container">
        <ElHeader class="app-header header">
            <ImageHeader
                :list="workspaceList"
                @workspace="onWorkspaceChange"
                @folder="onFolderClick"
            />
        </ElHeader>

        <ElContainer>
            <ElAside class="app-aside aside" v-if="folderList.length">
                <ImageAside
                    v-model="folder"
                    :list="folderList"
                    @change="onFolderClick"
                />
            </ElAside>

            <ElMain style="padding: 0">
                <ImageMain
                    ref="refMain"
                    :list="imageList"
                    @remove="onRemoveClick"
                />
            </ElMain>
        </ElContainer>
    </ElContainer>

    <ImageMagic ref="refMagic" :list="imageList" @batch="onRemove" />
</template>

<script setup lang="ts">
import ImageHeader from './Header.vue'
import ImageAside from './Aside.vue'
import ImageMain from './Main.vue'
import ImageMagic from './Magic.vue'
import {
    ElAside,
    ElContainer,
    ElHeader,
    ElMain,
    ElMessage,
    ElMessageBox,
} from 'element-plus'
import { useEventListener, useMagicKeys } from '@vueuse/core'
import { computed, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import {
    apis,
    ResourceType,
    RespResource,
    RespWorkspace,
    WorkspaceOperation,
} from '@/utils/index.js'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores/local-store.js'

interface ResourceItem extends RespResource {
    prev?: ResourceItem
    next?: ResourceItem
    children: ResourceItem[]
}

const { Workspace, KeyShift, KeyMeta } = useStore()

const route = useRoute()

const refMain = useTemplateRef('refMain')
const refMagic = useTemplateRef('refMagic')

const workspaceList = shallowRef<RespWorkspace[]>([])
const folderList = shallowRef<RespResource[]>([])
const imageList = shallowRef<RespResource[]>([])

const folder = computed(() => route.hash?.slice(1))

onMounted(async () => {
    await listWorkspace()
    await listImage(folder.value, true)
})
// MARK: 获取工作区
async function listWorkspace() {
    const {
        data: { list },
    } = await apis.Images.listWorkspace()
    workspaceList.value = list

    let isActive = false
    if (Workspace.value) {
        /** 缓存工作区是否可用 */
        isActive =
            list.find(item => item.key === Workspace.value)?.isActive || false
    }
    if (!isActive) {
        /** 缓存工作区不存在 || 缓存工作区不可用 */
        Workspace.value = list.find(item => item.isActive)?.key
    }
    // FIXME: 没有工作区怎么办
}
// MARK: 获取图片和目录
async function listImage(folder?: string, updateParent?: boolean) {
    const res = await apis.Images.listImage({
        workspace: Workspace.value,
        folder,
    })
    const _folderList: RespResource[] = []
    const _imageList: RespResource[] = []

    for (const item of res.data.list) {
        if (item.type === ResourceType.File) {
            _imageList.push(item)
        } else if (item.type === ResourceType.Folder) {
            _folderList.push(item)
        }
    }
    folderList.value = _folderList
    imageList.value = _imageList
    refMain.value?.scrollToTop()

    if (updateParent) {
        await listParentFolder(
            folder?.split('/').slice(0, -1).join('/') || undefined,
        )
    }
}
// MARK: 获取父级目录
let resourceMap: Recordable<ResourceItem> = {}
async function listParentFolder(folder?: string) {
    resourceMap = {}
    const res = await apis.Images.listImage({
        workspace: Workspace.value,
        folder,
    })

    let prevResource: ResourceItem | undefined = undefined
    for (const item of res.data.list) {
        if (item.type === ResourceType.File) {
            continue
        }
        const currResource: ResourceItem = {
            ...item,
            prev: prevResource,
            next: undefined,
            children: [],
        }
        if (prevResource) {
            prevResource.next = currResource
        }
        resourceMap[item.name] = currResource
        prevResource = currResource
    }
}
// MARK: 操作工作区
async function operateWorkspcae(
    operation: WorkspaceOperation,
    folder?: string,
) {
    await apis.Images.operateWorkspcae({
        operation,
        workspace: Workspace.value,
        folder,
    })
}
// MARK: 切换目录
async function changeFolder(
    type: PickKey<ResourceItem, 'prev' | 'next'>,
    backInEmpty?: boolean,
) {
    const folderList = folder.value?.split('/') || []
    const name = folderList.pop() || ''
    const tarName = resourceMap[name]?.[type]?.name
    if (!tarName) {
        if (backInEmpty) {
            await backFolder()
        }
        return
    }

    folderList.push(tarName)
    const _folder = folderList.join('/')
    router.push({ hash: `#${_folder}` })
    await listImage(_folder)
}
// MARK: 返回父级目录
async function backFolder() {
    const folderList = folder.value?.split('/') || []
    if (!folderList[0]) {
        return
    }

    const _folder = folderList.slice(0, -1).join('/')
    router.push({ hash: `#${_folder}` })
    await listImage(_folder, true)
}
// MARK: 删除目录
async function removeFolder() {
    if (!folder.value) {
        return
    }

    await apis.Images.removeImage({
        workspace: Workspace.value,
        image: folder.value,
    })
    await changeFolder('next', true)
}
// MARK: 点击图片删除
async function onRemoveClick(item: RespResource, index: number) {
    let count = 1
    if (KeyMeta.value) {
        // Magic Remove
        refMagic.value?.open(index)
        return
    } else if (KeyShift.value) {
        count = index + 1
    }
    let scroll = false
    if (count > 1) {
        const isConfirm = await batchOperationConfirm()
        if (!isConfirm) {
            return
        }
        scroll = true
    }
    await onRemove(item, index, count)
    if (scroll) {
        refMain.value?.scrollToTop()
    }
}
// MARK: 删除图片
async function onRemove(item: RespResource, index: number, count: number) {
    await apis.Images.removeImage({
        workspace: Workspace.value,
        image: item.path,
        count: count,
    })
    imageList.value.splice(index - count + 1, count)
    imageList.value = [...imageList.value]
}
// MARK: 快捷键
let isLoading = false
// NOTE: 长按触发多次
useEventListener('keydown', async (e: KeyboardEvent) => {
    if (isLoading) {
        return
    } else if (KeyShift.value) {
        isLoading = true
        if (e.key === 'Z') {
            await apis.Images.revokeImage()
        }
        isLoading = false
    }
})
// NOTE: 长按只触发一次
const {
    // New Line
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Backspace,
    K,
    O,
    T,
} = useMagicKeys()
watch(
    [
        KeyShift,
        // KeyMeta,
        ArrowUp,
        ArrowDown,
        ArrowLeft,
        ArrowRight,
        Backspace,
        K,
        O,
        T,
    ],
    async () => {
        if (isLoading) {
            return
        }

        isLoading = true
        if (!KeyShift.value) {
            if (ArrowLeft?.value) {
                refMain.value?.changeImage('prev')
            } else if (ArrowRight?.value) {
                refMain.value?.changeImage('next')
            }
        } else {
            if (ArrowUp?.value) {
                await changeFolder('prev')
            } else if (ArrowDown?.value) {
                await changeFolder('next')
            } else if (ArrowLeft?.value) {
                await backFolder()
            } else if (Backspace?.value) {
                await removeFolder()
            } else if (O?.value) {
                await operateWorkspcae(
                    WorkspaceOperation.Open,
                    folder.value || undefined,
                )
            } else if (T?.value) {
                await operateWorkspcae(WorkspaceOperation.Trash)
            } else if (K?.value) {
                await operateWorkspcae(WorkspaceOperation.Clear)
            }
        }
        isLoading = false
    },
)
// MARK: 工作区变更
async function onWorkspaceChange() {
    router.push({ hash: undefined })
    await listImage()
}
// MARK: 目录变更
async function onFolderClick(value?: string) {
    let hash = value
    if (value) {
        hash = `#${value}`
    }
    router.push({ hash })
    await listImage(value, true)
}
// MARK: 批量删除确认
async function batchOperationConfirm() {
    try {
        await ElMessageBox.confirm('确定是否删除?', {
            title: '批量删除',
            confirmButtonType: 'danger',
            center: true,
            showClose: false,
        })
        return true
    } catch (e) {
        ElMessage.closeAll()
        ElMessage.info('用户取消操作')
        return false
    }
}
</script>

<style scoped lang="scss">
.header {
    justify-content: flex-start;
}
.aside {
    width: 280px;
}
</style>
