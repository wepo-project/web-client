<script setup lang="ts">
import client from '../axios/client';
import { RouterLink } from 'vue-router';

const logout = () => {
    client.logout();
}
</script>

<template>
    <div class="flex flex-col p-2">
        <div class="btn btn-blue " @click="logout">Log Out</div>
        <div class="flex m-2">
            <router-link :to="{name: 'my_post'}" class="flex-1 flex items-center justify-center">My Posts</router-link>
        </div>
    </div>
</template>