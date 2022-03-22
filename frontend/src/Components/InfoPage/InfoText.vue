<template>
  <div>
    <div class="more info d-flex justify-content-between text-center" >
        <div class="col4 flex-fill" v-for="(info, index) in moreInfo" :class="[index === active ? 'col4 active' : '']" @click="moreInfoSelect(index)" :key="info.isbn">
              <h6>{{ info }}</h6>
        </div>
    </div>
    <div class="container pt-3">
      <div class="row">
        <p v-for="it in information" :key="it.isbn"> {{it.description}} </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['information'],
  name: 'InfoText',
  data() {
    return {
      moreInfo: ['DESCRIPTION', 'REVIEWS'],
      active: 0,
    }
  },
  methods: {
    moreInfoSelect(index) { //More Info area tab selector
      return this.active = index
    },
  }
}
</script>

<style scoped>
.col4 h6 {
  height: 25px;
  padding-bottom: 25px;
  border-bottom:1px solid lightgrey;
  color: grey;
  cursor: pointer;
}

.col4.active h6 {
  font-weight: bold;
  border-bottom:1px solid black !important;
  color: black;
}
</style>
