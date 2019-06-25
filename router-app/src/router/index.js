import Vue from 'vue'
import Router from 'vue-router'
import MachineContainer from '@/components/MachineContainer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MachineContainer',
      component: MachineContainer
    }
  ]
})
