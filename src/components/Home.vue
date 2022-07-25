<script lang="ts">
let oldState: PagingData<PostModel>  = defaultPaging();
</script>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { reactive } from "vue";
import client from "../axios/client";
import { defaultPaging, PagingData, PostModel } from "../data";
import Post from "./Post.vue";
import NavBar from "./NavBar.vue";
import utils from "../utils/utils";

const state = reactive<PagingData<PostModel>>(
  utils.clone(oldState)
);

let pulling = false;
const getNextPage = async () => {
  if (pulling) {
    return;
  }
  if (!state.next) {
    console.log("没有更多了");
    return;
  }
  pulling = true
  let oldPage = state.page;
  try {
    const resp = await client.get("post", "browse", {
      params: {
        page: oldPage + 1,
      },
    });
    if (resp.data.list) {
      state.next = resp.data.next;
      state.page = resp.data.page;
      state.list = [...state.list, ...resp.data.list];
    }
  } catch(e) {
    console.error(e);
  } finally {
    pulling = false
  }
};

onMounted(async () => {
  if (!state.list.length) {
    utils.showLoading(getNextPage());
  }
});

onUnmounted(() => {
  oldState = utils.clone(state);
})

const onScroll = async (e: UIEvent) => {
  if (utils.isScrollToBottom(e, 200) && utils.throttle(onScroll)) {
    await getNextPage();
  }
}

</script>

<template>
  <NavBar :has-back="false" title="HOME">
    <div class="h-full overflow-scroll  hidden-scrollbar" @scroll="onScroll">
      <div v-for="(item) in state.list" :key="item.id">
        <Post :item="item"></Post>
      </div>
    </div>
  </NavBar>
</template>