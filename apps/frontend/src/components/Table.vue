<template>
    <div :style="style" class="com-table">
        <ComFilter
            ref="refFilter"
            v-if="$slots.filter"
            :search="search"
            :reset="reset"
            @reset="$emit('reset')"
            @search="$emit('search')"
        >
            <template #before-operation>
                <slot name="filter-before-operation" />
            </template>

            <template #default>
                <slot name="filter" />
            </template>

            <template #after-operation>
                <slot name="filter-after-operation" />
            </template>
        </ComFilter>

        <div v-if="$slots.title || title" class="com-table-title">
            <slot name="title">{{ title }}</slot>
        </div>

        <ElTable v-bind="BindTable" ref="refTable" :data="data">
            <slot />

            <ElTableColumn
                v-if="$slots.operation"
                prop="$operation"
                :label="opLabel"
                :width="opWidth"
            >
                <template #default="{ row }">
                    <div class="flex com-table-operation">
                        <slot name="operation" :row="row" />
                    </div>
                </template>
            </ElTableColumn>
        </ElTable>

        <slot name="pagination" v-if="pagination">
            <ElPagination
                v-bind="BindPagination"
                class="com-table-pagination"
                ref="refPagination"
            />
        </slot>
    </div>
</template>

<script setup lang="ts">
import ComFilter from './Filter.vue'
import { ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { computed, nextTick, onMounted, ref, useTemplateRef, Ref } from 'vue'
import { Pagination, VueProps } from '@/utils'

export interface Props {
    /** 数据项 */
    data: any[]
    /** 标题 */
    title?: string
    /** 表格高度 */
    height?: string
    /** 分页配置 */
    pagination?: Pagination
    /** 显示搜索按钮 */
    search?: boolean
    /** 显示重置按钮 */
    reset?: boolean
    /** 操作列配置 */
    opLabel?: string
    opWidth?: string | number
    /** el-table 原生配置 */
    tableProps?: VueProps<typeof ElTable>
}

const props = withDefaults(defineProps<Props>(), {
    height: '100%',
    search: true,
    reset: true,
    opLabel: '操作',
    opWidth: 80,
})
const emits = defineEmits([
    'page-size',
    'current-page',
    'row-click',
    'reset',
    'search',
])

const tableHeight = ref('calc(100%)')
const refFilter = useTemplateRef('refFilter')
const refPagination = useTemplateRef('refPagination')
const refTable = useTemplateRef('refTable')

const style = computed(() => ({ height: props.height }))
const BindTable = computed<VueProps<typeof ElTable>>(() => ({
    ...(props.tableProps || {}),

    height: tableHeight.value,
    stripe: true,
    border: true,
    fit: true,
    headerRowStyle: {
        height: '49px',
    },
    'onRow-click': (row: any) => emits('row-click', row),
}))
const BindPagination = computed<VueProps<typeof ElPagination>>(() => ({
    ...(props.pagination || {}),

    background: true,
    layout: '->, total, prev, pager, next, sizes',
    'onUpdate:page-size': (size: number) => {
        emits('page-size', size)
        refTable.value?.setScrollTop(0)
    },
    'onUpdate:current-page': (page: number) => {
        emits('current-page', page)
        refTable.value?.setScrollTop(0)
    },
}))

onMounted(() => {
    nextTick(() => {
        let otherHeight = 0
        if (refFilter.value) {
            otherHeight += getOffsetHeight(refFilter) + 10
        }
        if (refPagination.value) {
            otherHeight += getOffsetHeight(refPagination) + 10
        }
        tableHeight.value = `calc(100% - ${otherHeight}px)`
    })
})
const getOffsetHeight = (ref: Ref) => ref.value?.$el.offsetHeight || 0
</script>

<style lang="scss" scoped>
// .com-talbe {
// }
.com-table-pagination {
    margin-top: 10px;
}
.com-table-title {
    width: 100%;
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    margin: 20px 0;
}
.com-table-operation:deep() {
    .el-icon {
        font-size: 22px;

        &:hover {
            color: var(--el-color-primary);
            cursor: pointer;
        }
    }
    .el-icon + .el-icon {
        margin-left: 10px;
    }
}
</style>
