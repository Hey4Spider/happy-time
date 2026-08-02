<template>
    <ElButton ref="refButton" v-bind="buttonAttrs" @click="onClick">
        <slot />
    </ElButton>
</template>

<script setup lang="ts" generic="T">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { onLongPress } from '@vueuse/core'
import { ElButton } from 'element-plus'
import { VueProps } from '@/utils'

const props = defineProps<{
    data?: T
    buttonAttrs?: Omit<VueProps<typeof ElButton>, 'onClick'>
}>()
const emits = defineEmits<{
    click: [data: T]
    'long-press': [data: T]
}>()

const refButton = useTemplateRef('refButton')

let stop: ReturnType<typeof onLongPress>

onMounted(() => {
    stop = onLongPress(
        refButton.value?.$el ?? refButton.value,
        () => emits('long-press', props.data as T),
        { modifiers: { prevent: true } },
    )
})

onBeforeUnmount(() => stop?.())

function onClick() {
    emits('click', props.data as T)
}
</script>
