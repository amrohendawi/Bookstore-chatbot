import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/views/Home.vue');
const Books = () => import('@/views/Books.vue');
const Orders = () => import('@/views/Orders.vue');
const Info = () => import('@/views/Info.vue');
const Orderinfo = () => import('@/views/Orderinfo.vue');
const OrderProcess = () => import('@/views/OrderProcess.vue');


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
      path: '/books',
      name: 'Books',
      component: Books
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    },
    {
      path: '/info',
      name: 'Info',
      component: Info
    },
    {
      path: '/orderinfo',
      name: 'Orderinfo',
      component: Orderinfo
    },
    {
      path: '/orderprocess',
      name: 'OrderProcess',
      component: OrderProcess
    }
  ],
  mode: 'history'
})
