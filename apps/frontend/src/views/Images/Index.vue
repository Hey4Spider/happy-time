<template>
    <ElContainer class="app-container">
        <ElHeader class="app-header header">
            <ImageHeader
                :list="workspaceList"
                :count="imageList.length"
                @workspace="onWorkspaceChange"
                @folder="onFolderClick"
                @remove="removeFolder"
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
    ImageItem,
    isValidImage,
    ResourceType,
    RespResource,
    RespWorkspace,
    WorkspaceOperation,
} from '@/utils/index.js'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores'
import { sleep } from '@shared'

interface ResourceItem extends RespResource {
    prev?: ResourceItem
    next?: ResourceItem
    children: ResourceItem[]
}

const Store = useGlobalStore()

const route = useRoute()

const refMain = useTemplateRef('refMain')
const refMagic = useTemplateRef('refMagic')

const workspaceList = shallowRef<RespWorkspace[]>([])
const folderList = shallowRef<RespResource[]>([])
const imageList = shallowRef<ImageItem[]>([])

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
    if (Store.Workspace) {
        /** 缓存工作区是否可用 */
        isActive =
            list.find(item => item.key === Store.Workspace)?.isActive || false
    }
    if (!isActive) {
        /** 缓存工作区不存在 || 缓存工作区不可用 */
        Store.Workspace = list.find(item => item.isActive)!.key
    }
    // FIXME: 没有工作区怎么办
}
// MARK: 获取图片和目录
async function listImage(folder?: string, updateParent?: boolean) {
    const res = await apis.Images.listImage({
        workspace: Store.Workspace,
        folder,
    })
    const _folderList: RespResource[] = []
    const _imageList: ImageItem[] = []

    for (const item of res.data.list) {
        if (item.type === ResourceType.Folder) {
            _folderList.push(item)
        } else if (item.type === ResourceType.File) {
            _imageList.push({
                ...item,
                isImage: isValidImage(item.path),
            })
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
        workspace: Store.Workspace,
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
    let notify: string = ''
    if (operation === WorkspaceOperation.Clear) {
        notify = '删除成功'
    }
    await apis.Images.operateWorkspcae(
        {
            operation,
            workspace: Store.Workspace,
            folder,
        },
        { notify },
    )
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

    await apis.Images.removeImage(
        {
            workspace: Store.Workspace,
            image: folder.value,
        },
        { notify: '删除成功' },
    )
    const folderList = folder.value?.split('/') || []
    const name = folderList.pop() || ''
    const tar = resourceMap[name]!
    if (tar.prev) {
        tar.prev.next = tar.next
    }
    if (tar.next) {
        tar.next.prev = tar.prev
    }
    await changeFolder('next', true)
}
// MARK: 点击图片删除
async function onRemoveClick(item: RespResource, index: number) {
    let count = 1
    if (Store.KeyMeta) {
        // Magic Remove
        refMagic.value?.open(index)
        return
    } else if (Store.KeyShift) {
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
        workspace: Store.Workspace,
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
    } else {
        isLoading = true
        if (Store.KeyShift && e.key === 'Z') {
            await apis.Images.revokeImage({
                notify: '撤销成功',
            })
        } else if (!Store.KeyShift && e.key === 'ArrowRight') {
            refMain.value?.changeImage('next')
            await sleep(80)
        } else if (!Store.KeyShift && e.key === 'ArrowLeft') {
            refMain.value?.changeImage('prev')
            await sleep(80)
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
    Backspace,
    K,
    O,
    T,
} = useMagicKeys()
watch(
    [() => Store.KeyShift, ArrowUp, ArrowDown, ArrowLeft, Backspace, K, O, T],
    async () => {
        if (isLoading || !Store.KeyShift) {
            return
        }

        try {
            isLoading = true
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
        } catch (e) {
            console.error(e)
        } finally {
            isLoading = false
        }
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
