<script setup lang="ts">
import client from '../axios/client';
import { RouterLink } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import store from '../store';
const user = store.state.user;
const logout = () => {
    client.logout();
}
</script>

<template>
    <NavBar :has-back="false" title="我的">
        <div class="flex items-center mb-2 p-2 border-b">
            <img class="w-10 h-10 rounded" :src="user!.avatar_url" alt="avatar" />
            <div class="ml-2">
                <div class="font-bold text-lg">{{user?.nick??""}}</div>
                <div class="text-sm text-gray-500">id:{{user?.id??""}}</div>
            </div>
            <div class="ml-auto text-sm btn btn-blue " @click="logout">退出登录</div>
        </div>
        <div class="flex m-2">
            <router-link :to="{name: 'my_post'}" class="flex-1 flex items-center justify-center">我的内容</router-link>
        </div>
    </NavBar>
</template>