<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import client from '../axios/client';
import { NoticeComment, PagingData, defaultPaging, NoticePost, NoticeFriend } from '../data';
import utils from '../utils/utils';
import NavBar from './NavBar.vue';
import Tabs, { Tab } from './Tabs.vue';


const post_tab: Tab = { name: "Post" };
const friend_tab: Tab = { name: "Friend" };

const comments_tab: Tab = { name: "Comments" };
const likes_tab: Tab = { name: "Likes" };
const hates_tab: Tab = { name: "Hates" };

const friend_add_tab: Tab = { name: "New Friend" };
const friend_remove_tab: Tab = { name: "Lost Friend" };

const state = reactive<{
    comments: PagingData<NoticeComment>,
    likes: PagingData<NoticePost>,
    hates: PagingData<NoticePost>,
    friend_add_list: PagingData<NoticeFriend>,
    friend_remove_list: PagingData<NoticeFriend>,
    tabs_main: Tab[],
    tabs_post: Tab[],
    tabs_friend: Tab[],
    currTabMain: string,
    currTabSecond: string,
}>({
    comments: defaultPaging(),
    likes: defaultPaging(),
    hates: defaultPaging(),
    friend_add_list: defaultPaging(),
    friend_remove_list: defaultPaging(),
    tabs_main: [
        post_tab, friend_tab,
    ],
    tabs_post: [
        comments_tab, likes_tab, hates_tab,
    ],
    tabs_friend: [
        friend_add_tab, friend_remove_tab,
    ],
    currTabSecond: comments_tab.name,
    currTabMain: post_tab.name,
})

onMounted(async () => {
    onMainTabChange();
})

const onMainTabChange = (name: string = post_tab.name) => {
    state.currTabMain = name;
    switch(name) {
        case post_tab.name:
            onPostTabChange();
            break;
        case friend_tab.name:
            break;
    }
}

const onPostTabChange = async (name: string = comments_tab.name) => {
    state.currTabSecond = name;
    switch (name) {
        case comments_tab.name:
            _get_data('msg', 'comments', 'comments');
            break;
        case likes_tab.name:
            _get_data('msg', 'likes', 'likes');
            break;
        case hates_tab.name:
            _get_data('msg', 'hates', 'hates');
            break;
    }
}

const onFriendTabChange = (name: string = friend_add_tab.name) => {
    state.currTabSecond = name;
    switch(name) {
        case friend_add_tab.name:
            _get_data('msg', 'friend_add', 'friend_add_list');
            break;
        case friend_remove_tab.name:
            _get_data('msg', 'friend_remove', 'friend_remove_list');
            break;
    }
}

async function _get_data(model:string, func: string, field: keyof typeof state) {
    let resp = await client.post(model, func, {
        data: { page: 1 },
    })
    if (resp.data.list) {
        state[field] = resp.data;
    }
}

// const nick = store.state.user?.nick ?? '';
</script>

<template>
    <NavBar title="Notification" :has-back="false">
        <Tabs :tabs="state.tabs_main" :initial="0" @change="onMainTabChange"/>
        <template v-if="state.currTabMain == post_tab.name">
            <Tabs :tabs="state.tabs_post" :initial="0" @change="onPostTabChange"/>
            <div v-if="state.currTabSecond == comments_tab.name">
                <div v-for="(item) in state.comments.list"
                    @click="$router.push({ name: 'po', params: { id: item.post_id } })" class="content_container block border-b px-4 py-3">
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
                                class="reference_content block cursor-pointer rounded p-2">
                                <div class="mb-1 text-xs dark:text-gray-200 whitespace-pre-line">{{ item.origin }}</div>
                                <div class="text-xs text-gray-500">{{ utils.format_time(item.origin_create_time) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="state.currTabSecond == likes_tab.name">
                <div v-for="(item) in state.likes.list" class="content_container block border-b px-4 py-3"
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
                        <div class="reference_content flex-shrink-0 block cursor-pointer rounded bg-gray-100 dark:bg-gray-800 p-2 w-[20vw] whitespace-pre-line">
                            <div class="mb text-xs dark-white whitespace-pre-line">{{ item.content }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="state.currTabSecond == hates_tab.name">
                <div v-for="(item) in state.hates.list" class="content_container block border-b px-4 py-3"
                    @click="$router.push({ name: 'po', params: { id: item.post_id } })">
                    <div class="flex">
                        <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                        <div class="flex-1 flex-col ml-4 mr-1">
                            <div class="mb-1 max-w-xs">
                                <span class="text-base dark-white text-violet-400 whitespace-pre-wrap break-all break-words">{{ item.sender.nick }}</span>
                                <span class="text-base mr-2 text-neutral-500 dark:text-neutral-400"> 反感了你</span>
                            </div>
                            <div class="text-sm text-gray-500">{{ utils.format_time(item.create_time, utils.MONTH) }}</div>
                        </div>
                        <div class="reference_content flex-shrink-0 block cursor-pointer rounded bg-gray-100 dark:bg-gray-800 p-2 w-[20vw] whitespace-pre-line">
                            <div class="mb text-xs dark-white whitespace-pre-line">{{ item.content }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="state.currTabMain == friend_tab.name">
            <Tabs :tabs="state.tabs_friend" :initial="0" @change="onFriendTabChange"/>
            <template v-if="state.currTabSecond == friend_add_tab.name">
                <div v-for="(item) in state.friend_add_list.list"
                    class="content_container block border-b px-4 py-3">
                    <div class="flex">
                        <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                        <div class="flex-1 flex flex-col ml-4">
                            <div class="mb-1">
                                <span class="text-base dark-white text-violet-400">{{ item.sender.nick }}</span>
                                <span class="text-base mr-2 text-neutral-500 dark:text-neutral-400"> 添加你为好友</span>
                                <span class="text-sm text-gray-500">{{ utils.format_time(item.create_time) }}</span>
                            </div>
                            <div class="mb-2 text-base dark-white whitespace-pre-line">{{ item.msg }}</div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="state.currTabSecond == friend_remove_tab.name">
                <div v-for="(item) in state.friend_remove_list.list"
                    class="content_container block border-b px-4 py-3">
                    <div class="flex">
                        <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                        <div class="flex-1 flex flex-col ml-4">
                            <div class="mb-1">
                                <span class="text-base dark-white text-violet-400">{{ item.sender.nick }}</span>
                                <span class="text-base mr-2 text-neutral-500 dark:text-neutral-400"> 把你从好友列表移除</span>
                                <span class="text-sm text-gray-500">{{ utils.format_time(item.create_time) }}</span>
                            </div>
                            <div class="mb-2 text-base dark-white whitespace-pre-line">{{ item.msg }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </NavBar>
</template>