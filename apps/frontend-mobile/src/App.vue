<template>
    <RouterView v-if="isPassed" />

    <div v-else class="flex-center pass-wrap">
        <div class="flex pass-form">
            <ElInput
                v-model="password"
                placeholder="请输入密码"
                type="password"
            />
            <ElButton class="pass-btn" type="primary" @click="onSubmit">
                确定
            </ElButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElButton, ElInput, ElNotification } from 'element-plus'
import { onMounted, ref } from 'vue'
import { apis } from './utils'

const isPassed = ref(false)
const password = ref('')

onMounted(() => {
    isPassed.value = !!localStorage.getItem('IS_PASSED')
})

async function onSubmit() {
    const { data } = await apis.Public.login({
        password: password.value,
    })
    if (data.status) {
        isPassed.value = data.status
        localStorage.setItem('IS_PASSED', 'true')
    } else {
        ElNotification.error('密码错误')
    }
}
</script>

<style scoped>
.pass-wrap {
    width: 100%;
    margin-top: 200px;
}
.pass-form {
    width: 80%;
}
.pass-btn {
    margin-left: 10px;
}
</style>
