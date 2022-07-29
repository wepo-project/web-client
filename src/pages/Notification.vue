<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import client from '../axios/client';
import { NoticeComment, PagingData, defaultPaging, NoticePost, NoticeFriend } from '../data';
import utils from '../utils/utils';
import NavBar from '../components/NavBar.vue';
import Tabs, { Tab } from '../components/Tabs.vue';
import SideBar from '../components/SideBar.vue';


const comments_tab: Tab = { name: "评论", emoji: "📩" };
const likes_tab: Tab = { name: "点赞", emoji: "👍" };
const hates_tab: Tab = { name: "反感", emoji: "👎" };

const friend_add_tab: Tab = { name: "好友添加", emoji: "👬" };
const friend_remove_tab: Tab = { name: "好友移除", emoji: "💔" };

const state = reactive<{
    comments: PagingData<NoticeComment>,
    likes: PagingData<NoticePost>,
    hates: PagingData<NoticePost>,
    friend_add_list: PagingData<NoticeFriend>,
    friend_remove_list: PagingData<NoticeFriend>,
    showSideBar: boolean
    tabs: Tab[],
    currTabName: string,
    currTabIndex: number,
}>({
    comments: defaultPaging(),
    likes: defaultPaging(),
    hates: defaultPaging(),
    friend_add_list: defaultPaging(),
    friend_remove_list: defaultPaging(),
    tabs: [
        comments_tab, likes_tab, hates_tab, friend_add_tab, friend_remove_tab,
    ],
    showSideBar: false,
    currTabName: '',
    currTabIndex: -1,
})

onMounted(async () => {
    setTab(comments_tab.name)
    onTabChange();
})

const setTab = (name: string) => {
    let index = state.tabs.findIndex(e => e.name === name);
    if (index !== -1) {
        state.currTabName = name;
        state.currTabIndex = index
    }
} 

const onTabChange = async (name: string = comments_tab.name) => {
    setTab(name);
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
        case friend_add_tab.name:
            _get_data('msg', 'friend_add', 'friend_add_list');
            break;
        case friend_remove_tab.name:
            _get_data('msg', 'friend_remove', 'friend_remove_list');
            break;
    }
    state.showSideBar = false;
}

async function _get_data(model: string, func: string, field: keyof typeof state) {
    const fut = client.post(model, func, {
        data: { page: 1 },
    })
    utils.showLoading(fut);
    const resp = await fut;
    if (resp.data.list) {
        state[field as any] = resp.data;
    }

}

// const nick = store.state.user?.nick ?? '';
</script>

<template>
    <NavBar :title="(state.tabs[state.currTabIndex]?.name ?? '') + '通知'" :has-back="false" :hasMenu="true" @menu-open="state.showSideBar = true">
        <div class="flex h-full flex-shrink-0">
            <SideBar :tabs="state.tabs" :initial="state.tabs.findIndex(e => e.name == state.currTabName)"
                @change="onTabChange" :show="state.showSideBar" @close="state.showSideBar = false">
            </SideBar>
            <div class="flex-1">
                <template v-if="state.currTabName == comments_tab.name">
                    <div v-for="(item) in state.comments.list"
                        @click="$router.push({ name: 'po', params: { id: item.post_id } })"
                        class="content_container block border-b p-3">
                        <div class="flex mb-1">
                            <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                            <div class="flex-1 flex flex-col ml-2">
                                <div>
                                    <span class="text-sm dark-white text-violet-400">{{ item.sender.nick }}</span>
                                    <span class="text-sm text-neutral-500 dark:text-neutral-400"> 评论了你</span>
                                </div>
                                <div class="text-sm text-gray-500">{{ utils.format_time(item.create_time) }}</div>
                            </div>
                        </div>
                        <div class="mb-2 text-base dark-white whitespace-pre-line">{{ item.content }}</div>
                        <div @click.stop="$router.push({ name: 'po', params: { id: item.origin_id } })"
                            class="reference_content block cursor-pointer rounded p-2">
                            <template v-if="item.origin != null">
                                <div class="mb-1 text-xs dark:text-gray-200 whitespace-pre-line">{{ item.origin }}
                                </div>
                                <div class="text-xs text-gray-500">{{ utils.format_time(item.origin_create_time!) }}
                                </div>
                            </template>
                            <div v-else class="text-xs text-gray-500">原文已删除</div>
                        </div>
                    </div>
                </template>
                <template v-if="state.currTabName == likes_tab.name">
                    <div v-for="(item) in state.likes.list" class="content_container block border-b p-3"
                        @click="$router.push({ name: 'po', params: { id: item.post_id } })">
                        <div class="flex">
                            <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                            <div class="flex-1 flex-col ml-2 mr-1">
                                <div class="max-w-xs">
                                    <span
                                        class="text-sm dark-white text-violet-400 whitespace-pre-wrap break-all break-words">{{
                                                item.sender.nick
                                        }}</span>
                                    <span class="text-sm mr-2 text-neutral-500 dark:text-neutral-400"> 赞了你</span>
                                </div>
                                <div class="text-xs text-gray-500">{{
                                        utils.format_time(item.create_time!, utils.MONTH)
                                }}
                                </div>
                            </div>
                            <div
                                class="reference_content flex-shrink-0 block cursor-pointer rounded bg-gray-100 dark:bg-gray-800 p-2 w-[20vw] whitespace-pre-line">
                                <div class="mb text-xs dark-white whitespace-pre-line">{{ item.content }}</div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="state.currTabName == hates_tab.name">
                    <div v-for="(item) in state.hates.list" class="content_container block border-b p-3"
                        @click="$router.push({ name: 'po', params: { id: item.post_id } })">
                        <div class="flex">
                            <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                            <div class="flex-1 flex-col ml-2 mr-1">
                                <div class="max-w-xs">
                                    <span
                                        class="text-sm dark-white text-violet-400 whitespace-pre-wrap break-all break-words">{{
                                                item.sender.nick
                                        }}</span>
                                    <span class="text-sm mr-2 text-neutral-500 dark:text-neutral-400"> 反感了你</span>
                                </div>
                                <div class="text-xs text-gray-500">{{ utils.format_time(item.create_time!, utils.MONTH)
                                }}
                                </div>
                            </div>
                            <div
                                class="reference_content flex-shrink-0 block cursor-pointer rounded bg-gray-100 dark:bg-gray-800 p-2 w-[20vw] whitespace-pre-line">
                                <div class="mb text-xs dark-white whitespace-pre-line">{{ item.content }}</div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="state.currTabName == friend_add_tab.name">
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
                <template v-else-if="state.currTabName == friend_remove_tab.name">
                    <div v-for="(item) in state.friend_remove_list.list"
                        class="content_container block border-b px-4 py-3">
                        <div class="flex">
                            <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                            <div class="flex-1 flex flex-col ml-4">
                                <div class="mb-1">
                                    <span class="text-base dark-white text-violet-400">{{ item.sender.nick }}</span>
                                    <span class="text-base mr-2 text-neutral-500 dark:text-neutral-400">
                                        把你从好友列表移除</span>
                                    <span class="text-sm text-gray-500">{{ utils.format_time(item.create_time) }}</span>
                                </div>
                                <div class="mb-2 text-base dark-white whitespace-pre-line">{{ item.msg }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </NavBar>
</template>