<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import client from '../axios/client';
import { NoticeComment, PagingData, defaultPaging, NoticeLike } from '../data';
import store from '../store';
import utils from '../utils/utils';

interface Tab {
    name: string
}

const comments_tab: Tab = { name: "Comments" };
const likes_tab: Tab = { name: "Likes" };
const hates_tab: Tab = { name: "Hates" };

const state = reactive<{
    comments: PagingData<NoticeComment>,
    likes: PagingData<NoticeLike>,
    tabs: Tab[],
    currTab: Tab,
}>({
    comments: defaultPaging(),
    likes: defaultPaging(),
    tabs: [
        comments_tab,
        likes_tab,
        hates_tab,
    ],
    currTab: comments_tab,
})

onMounted(async () => {
    onTabChange(comments_tab);
})

const onTabChange = async (item: Tab) => {
    state.currTab = item;
    switch (item.name) {
        case comments_tab.name:
            _onCommentPaging();
            break;
        case likes_tab.name:
            _onLikePaging();
            break;
    }
}

const _onCommentPaging = async () => {
    let resp = await client.post('msg', 'comments', {
        data: { page: 1 },
    })
    if (resp.data.list) {
        state.comments = resp.data;
    }
}
const _onLikePaging = async () => {
    let resp = await client.post('msg', 'likes', {
        data: { page: 1 },
    })
    if (resp.data.list) {
        state.likes = resp.data;
    }
}
const nick = store.state.user?.nick ?? '';
</script>

<template>
    <div>
        <ul class="tab-container">
            <li v-for="(item, index) in state.tabs" :class="index == state.tabs.length - 1 ? '' : 'mr-2'">
                <a href="#" class="tab" :class="state.currTab.name == item.name ? 'active' : ''"
                    @click="onTabChange(item)">{{ item.name }}</a>
            </li>
        </ul>
        <div v-if="state.currTab.name == comments_tab.name">
            <div v-for="(item) in state.comments.list"
                @click="$router.push({ name: 'po', params: { id: item.post_id } })" class="block border-b px-4 py-3">
                <div class="flex">
                    <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                    <div class="flex-1 flex flex-col ml-4">
                        <div class="mb-1">
                            <span class="text-base dark-white text-violet-400">{{ item.sender.nick }}</span>
                            <span class="text-base mr-2 text-neutral-500 dark:text-neutral-400"> 评论了你</span>
                            <span class="text-sm text-gray-500">{{ utils.format_time(item.create_time) }}</span>
                        </div>
                        <div class="mb-2 text-base dark-white whitespace-pre-line">{{ item.content }}</div>
                        <div :to="{ name: 'po', params: { id: item.origin_id } }"
                            class="block cursor-pointer rounded bg-gray-100 dark:bg-gray-800 p-2">
                            <div class="mb-1 text-xs dark:text-gray-200 whitespace-pre-line">{{ item.origin }}</div>
                            <div class="text-xs text-gray-500">{{ utils.format_time(item.origin_create_time) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="state.currTab.name == likes_tab.name">
            <div v-for="(item) in state.likes.list" class="block border-b px-4 py-3"
                @click="$router.push({ name: 'po', params: { id: item.post_id } })">
                <div class="flex">
                    <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                    <div class="flex-1 flex-col ml-4 mr-1">
                        <div class="mb-1 max-w-xs">
                            <span class="text-base dark-white text-violet-400 whitespace-pre-wrap break-all break-words">{{ item.sender.nick }}</span>
                            <span class="text-base mr-2 text-neutral-500 dark:text-neutral-400"> 赞了你</span>
                        </div>
                        <div class="text-sm text-gray-500">{{ utils.format_time(item.create_time, utils.MONTH) }}</div>
                    </div>
                    <div class="flex-shrink-0 block cursor-pointer rounded bg-gray-100 dark:bg-gray-800 p-2 w-[20vw] whitespace-pre-line">
                        <div class="mb text-xs dark-white whitespace-pre-line">{{ item.content }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>