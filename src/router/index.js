import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFound from '@/views/404View.vue';

const stage = import.meta.env.VITE_STAGE

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/404', component: NotFound },
    { path: '/:catchAll(.*)', redirect: '/404' },
    //{ path: '/home', redirect: { name: 'home' } },
    { 
      path: '/',
      name: 'home',
      component: HomeView,
      alias: ['/home'],
      meta: {
        requiresAuth: false,
      }
    },
    { 
      path: '/session',
      component: () => import('@/views/SessionView.vue'),
      children: [
        {
          path: '',
          components: {
            default: () => import('@/views/LoginView.vue'),
            register: () => import('@/views/RegisterView.vue')
          }
        }
      ],
    },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
    { 
      path: '/chats',
      name: 'chats',
      component: () => import('@/views/ChatsView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin']
      },
      children: [
        { 
          path: ':chatId(\\d+)',
          component: () => import('@/views/ChatView.vue'),
          props: (route) => {
            return {
              chatId: route.params.chatId
            }
          }
        }
      ],
    }
  ]
});

if (stage === 'test') {
  router.addRoute({
    path: '/profile',
    component: () => import('@/views/ProfileView.vue'),
  })
}

router.beforeEach((to, from) => {
  console.log(to, from)

  // if (to.meta?.requiresAuth && to.meta.roles.includes()){
  //   console.log(to.path, 'requires auth')
  //   return '/session'
  // }


  return true
})

export default router

