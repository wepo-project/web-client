import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: "home",
        component: () => import('./pages/Home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue'),
    },
    {
        path: '/reg',
        name: "reg",
        component: () => import('./components/Register.vue'),
    },
    {
        path: '/send',
        name: "send",
        component: () => import('./pages/SendPost.vue'),
    },
    {
        path: '/me',
        name: "me",
        component: () => import('./pages/Me.vue'),
    },
    {
        path: '/me/my_post',
        name: "my_post",
        component: () => import('./pages/MyPost.vue'),
    },
    {
        path: '/po/:id',
        name: 'po',
        component: () => import('./pages/PostDetail.vue'),
    },
    {
        path: '/notification',
        name: 'notification',
        component: () => import('./pages/Notification.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach((to, from) => {
    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;
    to.meta.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})

export default router;
export const routerTransitionDuration = 300;