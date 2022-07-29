<script lang="ts">
let oldState: PagingData<PostModel>  = defaultPaging();
</script>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { reactive } from "vue";
import client from "../axios/client";
import { defaultPaging, PagingData, PostModel } from "../data";
import Post from "../components/Post.vue";
import NavBar from "../components/NavBar.vue";
import utils from "../utils/utils";
import Paging from "../components/Paging.vue";
import { Deferred } from "../utils/deferred";

const state = reactive<PagingData<PostModel>>(
  utils.clone(oldState)
);

let pulling = false;
const getNextPage = async (initial = false) => {
  if (pulling) {
    return;
  }
  if (!initial && !state.next) {
    console.log("没有更多了");
    return;
  }
  pulling = true
  let oldPage = state.page;
  try {
    const resp = await client.get("post", "browse", {
      params: {
        page: initial ? 1 : oldPage + 1,
      },
    });
    if (resp.data.list) {
      state.next = resp.data.next;
      state.page = resp.data.page;
      if (initial) {
        state.list = resp.data.list;
      } else {
        state.list = [...state.list, ...resp.data.list];
      }
    }
  } catch(e) {
    console.error(e);
    return
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

const onRefresh = async (deferred: Deferred<any>) => {
  // 刷新
  getNextPage(true).then(deferred.resolve).catch(deferred.reject);
}

</script>

<template>
  <NavBar :has-back="false" title="首页">
    <Paging @refresh="onRefresh" @reach-bottom="getNextPage">
      <div v-for="(item) in state.list" :key="item.id">
        <Post :item="item"></Post>
      </div>
    </Paging>
  </NavBar>
</template>