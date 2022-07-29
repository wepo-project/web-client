<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import client from '../axios/client';
import { PostModel } from '../data';
import router from '../pageRouter';
import Post from '../components/Post.vue';
import NavBar from '../components/NavBar.vue';
import utils from '../utils/utils';

let id: string

let state = reactive({
  post: null as PostModel | null,
  comments: [] as PostModel[],
})

onMounted(async () => {
  id = router.currentRoute.value.params.id as string;
  console.log(`id: ${id}`, router.currentRoute.value)
  if (!id) return

  const fut = client.get('post', 'get_post', {
    params: { id },
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
      }
    });
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
    <Post v-if="state.post" :item="state.post" :show-delete="true" :prevent-jump="true" :collapse="false"></Post>
    <div class="h-2"></div>
    <div class="flex flex-col px-2 my-2">
      <textarea v-model="content" class="input w-full h-20 p-2 "></textarea>
      <div class="btn btn-blue w-fit mt-2" @click="onComment">Comment</div>
    </div>
    <template v-if="state.comments && state.comments.length">
      <div v-for="(item) in state.comments">
        <Post :item="item"></Post>
      </div>
    </template>
  </NavBar>
</template>