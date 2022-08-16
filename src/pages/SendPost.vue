<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NavBar from '../components/NavBar.vue';
import Badge from '../components/Badge.vue';
const inputVal = ref<string>();

const textarea = ref<HTMLTextAreaElement>();

onMounted(() => {
})

const at = () => {

}

</script>

<template>
    <NavBar title="发送">
        <textarea ref="textarea" class="inline outline-none resize-none h-full p-2 placeholder:text-gray-400 dark:bg-gray-800 dark:text-white" placeholder="写点什么..." :autofocus="true" :value="inputVal">
        </textarea>
        <div class="btn btn-blue" @click="at">@</div>
    </NavBar>
</template>
