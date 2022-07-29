<script lang="ts" setup>
</script>

<template>
    <div class="relative">
        <!-- <div class="absolute -top-1 -right-1 h-1 px-1 rounded-full bg-red-500 text-white text-xs leading-none flex items-center justify-center">{{1}}</div> -->
        <div class="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">1</div>
        <slot></slot>
    </div>
</template>