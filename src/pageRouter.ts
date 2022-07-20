import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import SendPost from "./components/SendPost.vue";
import Me from "./components/Me.vue";
import MyPost from "./components/MyPost.vue";
import PostDetail from "./components/PostDetail.vue";
import Notice from "./components/Notice.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: "home",
        component: Home,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/reg',
        name: "reg",
        component: Register,
    },
    {
        path: '/send',
        name: "send",
        component: SendPost,
    },
    {
        path: '/me',
        name: "me",
        component: Me,
    },
    {
        path: '/my_post',
        name: "my_post",
        component: MyPost,
    },
    {
        path: '/po/:id',
        name: 'po',
        component: PostDetail,
    },
    {
        path: '/notice',
        name: 'notice',
        component: Notice,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;