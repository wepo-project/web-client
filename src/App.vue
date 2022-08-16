<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import client from './axios/client';
import router, { routerTransitionDuration } from './router';
import Tabbar from './components/Tabbar.vue';

const state = reactive({
  isLogined: false,
  // loaded: false,
})

onMounted(async () => {
  let succ = false;
  try {
    succ = await client.loginWithToken();
  } catch(e) { console.error(e) }
  if (!succ) {
    router.push('/login')
  } else {
    router.push('/')
  }
  state.isLogined = client.isLogined();
})

const onAuth = () => {
  state.isLogined = true;
}
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <router-view @auth="onAuth" class="flex-auto overflow-scroll hidden-scrollbar" v-slot="{ Component }">
      <transition name="fade" mode="out-in" :duration="routerTransitionDuration">
        <component :is="Component" :key="$route.fullPath"></component>
      </transition>
    </router-view>
    <tabbar v-if="state.isLogined"></tabbar>
  </div>
</template>

<style lang="css">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes slide-left {
  from {
    transform: translateX(100vw);
  }
}
@keyframes slide-right {
  to {
    transform: translateX(100vw);
  }
}
</style>