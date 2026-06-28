<template>
    <ElMenu
        class="aside"
        unique-opened
        :default-active="defaultActive"
        :default-openeds="['0']"
        @select="onSelect"
    >
        <template v-for="item of MenuData" :key="item.route">
            <ElSubMenu v-if="item.children.length" :index="item.uid">
                <template v-slot:title>{{ item.label }}</template>
                <template v-for="child of item.children" :key="child.uid">
                    <ElMenuItem
                        v-if="child.route"
                        :index="child.route"
                        :style="itemStyle"
                    >
                        {{ child.label }}
                    </ElMenuItem>
                </template>
            </ElSubMenu>
            <ElMenuItem
                v-else-if="item.route"
                :index="item.route"
                :style="itemStyle"
            >
                {{ item.label }}
            </ElMenuItem>
        </template>
    </ElMenu>
</template>

<script lang="ts" setup>
import router from '@/router'
import { MenuData, MenuItem } from '@/utils'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps<{
    height?: number | string
}>()
const emits = defineEmits(['select'])

function getAsideDataItem(route: string, data: MenuItem[]) {
    for (const item of data) {
        if (item.route === route) {
            return item
        } else if (item.children?.length) {
            const res = getAsideDataItem(route, item.children)
            if (res) {
                return res
            }
        }
    }
}

const defaultActive = computed(() => route.path.split('#')[0])
const itemStyle = computed(() => {
    const style: Recordable = {}
    const height = props.height ? String(props.height) : undefined
    if (height && /^\d*(\.?)\d+(px|em|vh)?/.test(height)) {
        style.height = /\d$/.test(height) ? `${height}px` : height
    }
    return style
})

const onSelect = (route: string) => {
    const data = getAsideDataItem(route, MenuData)
    emits('select', data)
    router.push(route)
}
</script>

<style lang="scss" scoped>
.aside {
    --el-menu-bg-color: none;
    --el-menu-text-color: white;
    --el-menu-hover-bg-color: var(--el-text-color-primary);
    --el-menu-item-height: 50px;

    height: 100vh;

    :deep(.el-sub-menu__title):hover,
    .el-menu-item:hover {
        color: var(--el-color-primary);
    }

    .el-sub-menu .el-menu-item:first-child {
        border-top: 1px solid white;
    }
    .el-sub-menu,
    .el-menu-item {
        border-bottom: 1px solid white;
    }
    .el-sub-menu.is-opened {
        border-bottom: none;
    }
}
</style>
