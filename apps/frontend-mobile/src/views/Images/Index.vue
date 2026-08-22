<template>
    <ElContainer class="app-container">
        <ElHeader class="app-header header">
            <ImageHeader
                :workspace-list="workspaceList"
                :folder-list="folderList"
                :count="imageList.length"
                @workspace="onWorkspaceChange"
                @folder="onFolderClick"
                @back="backFolder"
            />
        </ElHeader>
        <ElMain class="app-main" style="padding: 0">
            <ImageMain
                ref="refMain"
                :list="imageList"
                @remove="onRemove"
                @remove-folder="removeFolder"
                @change-folder="changeFolder"
                @clear="onClear"
            />
        </ElMain>
    </ElContainer>
</template>

<script setup lang="ts">
import ImageHeader from './Header.vue'
import ImageMain from './Main.vue'
import {
    ElContainer,
    ElHeader,
    ElMain,
    ElMessage,
    ElMessageBox,
} from 'element-plus'
import { computed, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import {
    apis,
    ImageItem,
    isValidImage,
    ResourceType,
    RespResource,
    RespWorkspace,
    WorkspaceOperation,
} from '@/utils'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores'

interface ResourceItem extends RespResource {
    prev?: ResourceItem
    next?: ResourceItem
}

const Store = useGlobalStore()

const route = useRoute()

const refMain = useTemplateRef('refMain')

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
    } = await apis.Workspaces.listWorkspace()
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
        }
        if (prevResource) {
            prevResource.next = currResource
        }
        resourceMap[item.name] = currResource
        prevResource = currResource
    }
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
        } else {
            ElMessage.info('目录不存在')
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
        ElMessage.info('无法后退')
        return
    }

    const _folder = folderList.slice(0, -1).join('/')
    router.push({ hash: `#${_folder}` })
    await listImage(_folder, true)
}
// MARK: 删除目录
async function removeFolder({ force }: { force?: boolean } = {}) {
    if (!folder.value) {
        return
    } else if (force) {
        const isConfirm = await forceOperationConfirm()
        if (!isConfirm) {
            return
        }
    }

    await apis.Images.removeImage(
        {
            workspace: Store.Workspace,
            image: folder.value,
            force: force,
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
// MARK: 删除图片
async function onRemove(item: RespResource, index: number, count: number = 1) {
    let scroll = false
    if (count > 1) {
        const isConfirm = await batchOperationConfirm()
        if (!isConfirm) {
            return
        }
        scroll = true
    }
    await apis.Images.removeImage({
        workspace: Store.Workspace,
        image: item.path,
        count: count,
    })
    imageList.value.splice(index - count + 1, count)
    imageList.value = [...imageList.value]

    if (scroll) {
        refMain.value?.scrollToTop()
    }
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
// MARK: 强制删除确认
async function forceOperationConfirm() {
    try {
        await ElMessageBox.confirm('确定是否删除?', {
            title: '强制删除',
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

async function onClear() {
    const isConfirm = await forceOperationConfirm()
    if (!isConfirm) {
        return
    }

    await apis.Images.operateWorkspcae(
        {
            operation: WorkspaceOperation.Clear,
            workspace: Store.Workspace,
            folder: folder.value,
        },
        {
            notify: '删除成功',
        },
    )
}

watch(folder, folder => listImage(folder))
</script>

<style scoped lang="scss">
.header {
    justify-content: flex-start;
}
.app-main {
    height: calc(100svh - 50px);
}
</style>
