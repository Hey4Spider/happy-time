<template>
    <ElScrollbar ref="refScrollbar" height="calc(100vh - 50px)">
        <ElMenu class="aside" @select="onSelect" ref="refMenu">
            <ElMenuItem
                v-for="(item, index) of list"
                :key="item.path"
                :index="item.name"
            >
                <ElTooltip
                    class="menu-item"
                    :content="item.name"
                    placement="right"
                    :disabled="overflowList[index]"
                >
                    {{ item.name }}
                </ElTooltip>
            </ElMenuItem>
        </ElMenu>
    </ElScrollbar>
</template>

<script setup lang="ts">
import { RespResource } from '@/utils'
import { ElMenu, ElMenuItem, ElScrollbar, ElTooltip } from 'element-plus'
import { nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const emits = defineEmits<{
    change: [value: string]
}>()

const props = defineProps<{
    list: RespResource[]
}>()

const refScrollbar = useTemplateRef('refScrollbar')
const refMenu = useTemplateRef('refMenu')
const overflowList = shallowRef<boolean[]>([])

function onSelect(value: string) {
    let hash = route.hash?.slice(1)
    if (hash) {
        hash += `/${value}`
    } else {
        hash = value
    }
    emits('change', hash)
}

async function init() {
    await nextTick()
    const elList: HTMLCollection = refMenu.value?.$el.children
    const list: boolean[] = []
    for (const li of elList) {
        list.push(li.scrollWidth <= li.clientWidth)
    }
    overflowList.value = list
    refScrollbar.value?.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
    })
}

onMounted(init)

watch(
    () => props.list,
    () => init(),
)
</script>

<style lang="scss" scoped>
.aside {
    --el-menu-hover-bg-color: none;
    --el-menu-item-height: 50px;

    .el-menu-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        display: block;
        border-bottom: var(--el-border);

        &:hover {
            color: var(--el-color-primary);
        }
    }
}

.menu-item {
    width: 100%;
}
</style>
