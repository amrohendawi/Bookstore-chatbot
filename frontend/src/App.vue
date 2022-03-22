<template>
  <div id="app">
    <Header />
    <chatbot />
    <router-view />
    <Newsletter v-if="$route.path == '/'" />
  </div>
</template>

<script>
import Header from '@/Components/Header.vue'
import Chatbot from '@/Components/Chatbot.vue'
import Newsletter from '@/Components/Newsletter.vue'

export default{
  name: 'app',
  components: {
    Header, Chatbot, Newsletter
  },
  beforeCreate(){
    this.$store.commit('initBooks', this.$store.state);
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Exo+2');
#app {
  background-color: #F8F8F8 !important;
  font-family: 'Exo 2', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
