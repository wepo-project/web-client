<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import client from "../axios/client";
import Heart from "../svg/heart.vue";
import Comment from "../svg/comment.vue";
import Hate from "../svg/Hate.vue";
import { RouterLink, useRouter } from "vue-router";
import { PostModel } from "../data";
import store from "../store";
import utils from "../utils/utils";

const router = useRouter();

const props = withDefaults(defineProps<{
  item?: PostModel
  showDelete?: boolean
  /// 防止跳转
  preventJump?: boolean
  /// 折叠
  collapse?: boolean
}>(), {
  showDelete: false,
  preventJump: false,
  collapse: true,
});

let id = props.item?.id.toString();

const state = reactive({
  like_count: props.item?.like_count ?? 0,
  liked: props.item?.liked ?? false,
  hate_count: props.item?.hate_count ?? 0,
  hated: props.item?.hated ?? false,
  comment_count: props.item?.comment_count ?? 0,
  is_me: props.item?.sender.id == store.state.user?.id, // 是我自己发送的
})

const like = async () => {
  let is_cancel = state.liked;
  const resp = await client.get("post", is_cancel ? "cancel_like" : "like", {
    params: { id },
  });
  if (resp.data.succ) {
    state.liked = !is_cancel;
    state.like_count += is_cancel ? -1 : 1;
  }
  // 之前点过赞了
  else if (resp.data.code == 201) {
    state.liked = !is_cancel
  }
};

const hate = async () => {
  let is_cancel = state.hated;
  const resp = await client.get("post", is_cancel ? "cancel_hate" : "hate", {
    params: { id },
  });
  if (resp.data.succ) {
    state.hated = !is_cancel;
    state.hate_count += is_cancel ? -1 : 1;
  }
  // 之前点过赞了
  else if (resp.data.code == 201) {
    state.hated = !is_cancel
  }
};

const deletePost = async () => {
  await client.delete('post', 'delete', {
    data: { id }
  })
}

const check_detail = () => {
  if (!props.preventJump) {
    router.push({ name: 'po', params: { id } })
  }
}

</script>

<template>
  <template v-if="item != null">
    <div class="block content_container p-3 border-b dark:border-gray-500 group" :class="collapse?'select-none':''" @click="check_detail">
      <div class="flex pb-2">
        <img class="avatar rounded" :src="item!.sender.avatar_url" alt="avatar" />
        <div class="flex flex-col ml-2">
          <div class="dark-white">{{ item!.sender.nick }}</div>
          <div class="text-sm text-gray-500">{{ utils.format_time(item!.create_time) }}</div>
        </div>
      </div>
      <div class="mb-2 text-base dark-white whitespace-pre-line">
        <span>{{ item!.content }}</span>
        <template v-if="collapse && item!.content.length === 100">
          <span>...</span>
          <span class="text-blue-500">全文</span>
        </template>
      </div>
      <template v-if="item!.origin_id">
        <div class="block drop-shadow-md reference_content dark:filter-none rounded-md p-2 mb-2"
          @click.stop="item!.origin_content && $router.push({ name: 'po', params: { id: item!.origin_id } })">
          <div class="text-sm text-gray-400 mb-1">原文</div>
          <template v-if="item!.origin_content">
            <div class="flex pb-2">
              <img class="avatar rounded" :src="item!.origin_sender!.avatar_url" alt="avatar" />
              <div class="flex flex-col ml-2">
                <div class="dark-white">{{ item!.origin_sender!.nick }}</div>
                <div class="text-sm text-gray-500">{{ utils.format_time(item!.origin_create_time!) }}</div>
              </div>
            </div>
            <div class="dark-white text-sm whitespace-pre-line">{{ item!.origin_content! }}</div>
          </template>
          <div v-else class="text-gray-400 text-sm whitespace-pre-line">已被删除</div>
        </div>
      </template>
      <div class="flex items-center h-8" @click.stop="void">
        <Heart v-bind:liked="state.liked" @click="like" />
        <div class="ml-1 mr-2 dark-white select-none">{{ state.like_count }}</div>
        <Comment />
        <div class="ml-1 mr-2 dark-white select-none">{{ state.comment_count }}</div>
        <Hate v-bind:hated="state.hated" @click="hate" />
        <div class="ml-1 mr-2 dark-white select-none">{{ state.hate_count }}</div>
        <div v-if="showDelete && state.is_me"
          class="ml-auto text-stone-400 cursor-pointer border select-none border-transparent px-2 rounded-md hover:border-gray-100 hover:shadow-md hover:text-red-500"
          @click.stop="deletePost">DELETE</div>
      </div>
    </div>
  </template>
</template>

<style scoped>
.action-button {
  border: none;
  padding: 4px 10px;
  margin-right: 10px;
}

.active {
  background: #9c9cff;
  color: white
}

.avatar {
  width: 40px;
  height: 40px;
}
</style>