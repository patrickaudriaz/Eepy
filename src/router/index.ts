import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InputView from '../views/InputView.vue'
import NapView from '../views/NapView.vue'
import ResultView from '../views/ResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/input',
      name: 'input',
      component: InputView,
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView,
    },
    {
      path: '/nap',
      name: 'nap',
      component: NapView,
    },
  ],
})

export default router
