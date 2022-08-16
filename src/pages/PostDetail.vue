<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import client from '../axios/client';
import { PostModel } from '../data';
import router from '../router';
import Post from '../components/Post.vue';
import NavBar from '../components/NavBar.vue';
import utils from '../utils/utils';
import { AxiosError } from 'axios';

let id: string

let state = reactive({
  post: null as PostModel | null,
  comments: [] as PostModel[],
  notFound: false,
})

onMounted(async () => {
  id = router.currentRoute.value.params.id as string;
  console.log(`id: ${id}`, router.currentRoute.value)
  if (!id) return

  const fut = client.get('post', 'get_post', {
    params: { id },
    onFailed(e: AxiosError) {
      if (e.response?.status === 404) {
        state.notFound = true;
      }
    },
    ignoreError: true,
  })
  utils.showLoading(fut);
  const resp = await fut
  if (resp.data) {
    state.post = resp.data.post
    state.comments = resp.data.comments
  }
})

const content = ref('')

async function onComment() {
  if (content.value != '') {
    const resp = await client.post('post', 'comment', {
      data: {
        content: content.value,
        origin_id: id,
      },
    });
    console.log(resp);
    if (resp.data.id) {
      content.value = ""
      if (state.post) {
        state.post = {
          ...state.post!,
          comment_count: state.post!.comment_count + 1,
        }
      }
    }
  }
}

</script>

<template>
  <NavBar title="详情">
    <div v-if="state.notFound" class="flex flex-col justify-center items-center h-full">
      <div class="text-2xl font-bold dark-white">404</div>
      <div class="dark-white">内容不见了</div>
    </div>
    <Post v-else-if="state.post" :item="state.post" :show-delete="true" :prevent-jump="true" :collapse="false"></Post>
    <div class="h-2"></div>
    <template v-if="state.comments && state.comments.length">
      <div v-for="(item) in state.comments">
        <Post :item="item"></Post>
      </div>
    </template>
  </NavBar>
</template>