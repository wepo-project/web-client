<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import { reactive } from "vue";
import client from "../axios/client";
import { defaultPaging, PagingData, PostModel } from "../data";
import Post from "../components/Post.vue";
import NavBar from "../components/NavBar.vue";
import utils from "../utils/utils";

const state = reactive<PagingData<PostModel>>(
  defaultPaging()
);

const getNextPage = async () => {
  state.page = state.page + 1;
  const resp = await client.post("post", "my_post", {
    data: {
      page: state.page,
    },
  });
  state.next = resp.data.next;
  state.page = resp.data.next;
  state.list = resp.data.list;
};

onMounted(async () => {
  utils.showLoading(getNextPage());
});

</script>

<template>
  <NavBar title="我的">
    <div v-for="(item) in state.list" :key="item.id">
      <Post :item="item" :show-delete="true"></Post>
    </div>
  </NavBar>
</template>