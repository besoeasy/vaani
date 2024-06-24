import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/HomeView.vue')
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('./views/TimelineView.vue')
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('./views/PostView.vue')
    },
    {
      path: '/profile/:address',
      name: 'profile',
      component: () => import('./views/ProfileView.vue')
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('./views/UploadView.vue')
    }
  ]
})

export default router
