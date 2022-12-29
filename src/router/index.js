import Vue from 'vue'
import Router from 'vue-router'
import present from '@/components/present'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'present',
      component: present
    },
    {
      path: '/present',
      name: 'present',
      component: present
    },
    // {
    //   path: '/custom',
    //   name: 'custom',
    //   component: custom
    // },
    // {
    //   path: '/ZLadmin',
    //   name: 'ZLadmin',
    //   component: ZLadmin
    // }
  ]
})
