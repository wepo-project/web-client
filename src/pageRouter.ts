import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: "home",
        component: import('./components/Home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: import('./components/Login.vue'),
    },
    {
        path: '/reg',
        name: "reg",
        component: import('./components/Register.vue'),
    },
    {
        path: '/send',
        name: "send",
        component: import('./components/SendPost.vue'),
    },
    {
        path: '/me',
        name: "me",
        component: import('./components/Me.vue'),
    },
    {
        path: '/my_post',
        name: "my_post",
        component: import('./components/MyPost.vue'),
    },
    {
        path: '/po/:id',
        name: 'po',
        component: import('./components/PostDetail.vue'),
    },
    {
        path: '/notification',
        name: 'notification',
        component: import('./components/Notification.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;