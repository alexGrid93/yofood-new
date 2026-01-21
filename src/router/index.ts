import MainPage from '@/views/MainPage.vue'
import DeliveryCheckPage from '@/views/DeliveryCheckPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/delivery-check',
      name: 'delivery-check',
      component: DeliveryCheckPage,
    },
  ],
})

export default router
