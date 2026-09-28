<template>
    <ElScrollbar height="calc(100vh - 40px)">
        <div class="operation-group">
            <ElUpload
                class="upload-button"
                v-model:file-list="_fileList"
                multiple
                accept="image/*"
                :show-file-list="false"
                :auto-upload="false"
            >
                <ElButton type="primary">选择图片</ElButton>
            </ElUpload>
            <div class="operation-direction-wrap">
                <ElSelect class="operation-direction" v-model="direction">
                    <ElOption
                        label="横向"
                        :value="DirectionCategory.Horizontal"
                    />
                    <ElOption
                        label="纵向"
                        :value="DirectionCategory.Vertical"
                    />
                    <ElOption label="多列" :value="DirectionCategory.Column" />
                </ElSelect>
                <ElInputNumber
                    v-model="columns"
                    class="operation-columns"
                    placeholder="列数"
                    align="left"
                    step-strictly
                    :min="0"
                    :controls="false"
                    :disabled="direction !== DirectionCategory.Column"
                />
            </div>
            <ElButton @click="onConfirm" type="success">合并</ElButton>
        </div>

        <VueDraggable
            ref="el"
            v-model="fileList"
            :animation="300"
            class="draggable-wrap"
        >
            <div
                class="image-wrap"
                v-for="(item, index) in fileList"
                :key="item.url"
            >
                <ElIcon class="image-del" @click="onDelete(item, index)">
                    <CloseBold />
                </ElIcon>
                <ElImage class="image" :src="item.url" />
            </div>
        </VueDraggable>

        <ElDivider content-position="left">合并结果</ElDivider>
        <div class="operation-group">
            <ElInput
                v-model="mergeName"
                placeholder="文件名"
                :disabled="!mergeResult"
                class="operation-filename"
            />
            <ElButton
                :disabled="!mergeResult"
                type="success"
                @click="onDownload"
            >
                下载
            </ElButton>
        </div>
        <ElScrollbar :height="`calc(${resultHeight} + 8px)`">
            <ElImage
                class="image image-result"
                v-if="mergeResult"
                :src="mergeResult.url"
                :style="{ height: resultHeight }"
            />
        </ElScrollbar>
    </ElScrollbar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
    ElButton,
    ElDivider,
    ElIcon,
    ElImage,
    ElInput,
    ElInputNumber,
    ElOption,
    ElScrollbar,
    ElSelect,
    ElUpload,
    UploadRawFile,
    UploadUserFile,
} from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { apis, DirectionCategory } from '@/utils'
import { CloseBold } from '@element-plus/icons-vue'
import { ContentType } from '@apis'

interface FileItem {
    url: string
    raw: UploadRawFile
}
interface FileResult {
    url: string
    filename: string
}

const resultHeight = computed(() => {
    if (direction.value === DirectionCategory.Horizontal) {
        return '200px'
    } else if (direction.value === DirectionCategory.Vertical) {
        const cnt = fileList.value.length
        return `${200 * cnt}px`
    } else {
        const cnt = Math.ceil(fileList.value.length / columns.value)
        return `${200 * cnt}px`
    }
})

const columns = ref(0)
const direction = ref(DirectionCategory.Horizontal)
const _fileList = ref<UploadUserFile[]>([])
const fileList = ref<FileItem[]>([])
const mergeName = ref('')
const mergeResult = ref<FileResult>()
async function onConfirm() {
    const res = await apis.Images.mergeImage(
        {
            file: fileList.value.map(item => item.raw),
            direction: direction.value,
            columns: columns.value,
        },
        {
            type: ContentType.FormData,
            format: 'blob',
        },
    )
    mergeResult.value = {
        url: URL.createObjectURL(res.data),
        filename:
            res.headers['content-disposition'].match(/filename="?(.+?)"?$/)[1],
    }
}
function onDelete(file: FileItem, index: number) {
    fileList.value.splice(index, 1)
    directionWatcher(direction.value)
}
function onDownload() {
    const { url, filename } = mergeResult.value!
    const a = document.createElement('a')
    a.href = url
    a.download = mergeName.value ? mergeName.value : filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}
function directionWatcher(
    value: DirectionCategory,
    oldValue?: DirectionCategory,
) {
    if (value === DirectionCategory.Horizontal) {
        columns.value = fileList.value.length
    } else if (value === DirectionCategory.Vertical) {
        columns.value = 1
    } else if (oldValue) {
        columns.value = 2
    }
    mergeResult.value = undefined
}
watch(_fileList, async (files: UploadUserFile[]) => {
    for (const item of files) {
        const file = item.raw!
        fileList.value.push({
            url: URL.createObjectURL(file),
            raw: file,
        })
    }
    if (files.length) {
        _fileList.value = []
    }
    directionWatcher(direction.value)
})
watch(direction, directionWatcher, { immediate: true })
watch(columns, () => (mergeResult.value = undefined), { immediate: true })
</script>

<style scoped lang="scss">
.draggable-wrap {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    gap: 10px;
}
.image-wrap {
    position: relative;
}
.image-del {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    font-size: 22px;
    color: var(--el-color-info);

    &:hover {
        cursor: pointer;
        color: var(--el-color-danger);
    }
}
.image {
    cursor: move;
    height: 200px;
    border: var(--el-border);
    border-radius: var(--el-border-radius-base);
}
.image-add {
    width: 200px;
    height: 200px;
    border: var(--el-border);
    border-radius: var(--el-border-radius-base);
}

.operation-group {
    display: flex;
    margin-bottom: 10px;
}
.operation-direction-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 200px;
    margin: 0 10px;
}
:deep() {
    .operation-direction {
        width: 75px;
        .el-select__wrapper.is-focused,
        .el-select__wrapper {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            box-shadow: 0 0 0 1px var(--el-border-color) inset;
        }
    }
    .operation-columns {
        flex: 1;
        &.el-input-number {
            width: 100%;
        }
        .el-input__wrapper {
            padding: 1 11px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
    .image-result .el-image__inner {
        width: unset;
    }
}
.operation-filename {
    width: 200px;
    margin-right: 10px;
}
</style>
