<script lang="ts" setup>
import { ref } from 'vue'
import client from '../axios/client'
import router from '../pageRouter';
import utils from '../utils/utils';

const nickRef = ref('')
const pwdRef = ref('')

function onRegister() {
  const nick = nickRef.value.trim(), pwd = pwdRef.value.trim();
  if (!utils.validate([nick.length > 0, "情输入昵称"])) {
    return;
  }
  client.post("user", "register", {
    data: {
      nick: nickRef.value,
      pwd: pwdRef.value,
    },
    code: {
      201: "账号已存在",
    },
    onSuccess(_resp) {
      utils.showTopTips('注册成功')
      router.push('/login')
    }
  });
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center py-2 px-4">
    <div class="flex w-full mb-3">
      <span
        class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
        @
      </span>
      <input v-model.trim="nickRef" type="text"
        class="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="elonmusk">
    </div>
    <div class="flex w-full mb-3">
      <input v-model.trim="pwdRef" type="password"
        class="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="password">
    </div>
    <div class="flex w-full">
      <div class="flex-auto btn btn-green mr-1 text-center" @click="onRegister">注册</div>
      <router-link class="flex-shrink btn btn-main ml-1 text-center border" to="/login">去登录</router-link>
    </div>
  </div>
</template>