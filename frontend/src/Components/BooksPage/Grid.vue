<template>
  <div class="container grid">
    <div class="row justify-content-around">
      <div class="row col-6 pb-4 pr-1">
        <div class="dropdown">
          <a class="btn btn-light dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">SORT BY
            <span style="color:#f2be00;">{{ sortButton }}</span>
          </a>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a class="dropdown-item" @click="sortDate">Date</a>
            <a class="dropdown-item" @click="sortPrice" >Price</a>
            <a class="dropdown-item" @click="sortTrend">Trending</a>
          </div>
        </div>
      </div>
      <div class="row col-6 flex-row-reverse">
        <div class="view-button">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle d-block d-lg-none d-xl-none" role="button" id="MenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Genres</button>
            <div class="dropdown-menu" aria-labelledby="MenuLink">
              <a class="dropdown-item" v-for="g in this.$store.state.genres"
              v-bind:key="g"
              @click="sortI(g)">
              {{ g }}</a>
              <a class="dropdown-item" @click="reSet">Reset</a>
            </div>
          </div>
        </div>
        <div class="view-button">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle d-block d-lg-none d-xl-none" role="button" id="MenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Languages</button>
            <div class="dropdown-menu" aria-labelledby="MenuLink">
              <a class="dropdown-item" v-for="g in this.$store.state.languages"
              v-bind:key="g"
              @click="sortL(g)">
              {{ g }}</a>
              <a class="dropdown-item" @click="reSet">Reset</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col col-xl-3 col-lg-3 d-none d-lg-block d-xl-block">
          <div class="card-selector">
            <div class="card-body p-5">
              <div class="search-title">
                <button class="btn" style="background-color:transparent; color:#dcdcdc" data-toggle="collapse" href="#categoriesCollapse">
                  <h4 class="if-not-collapsed">Catagories -</h4>
                  <h4 class="if-collapsed">Catagories +</h4>
                </button>
                <br>
                <div class="collapse" id="categoriesCollapse">
                  <br>
                  <h5 v-for="g in this.$store.state.genres"
                    v-bind:key="g"
                    @click="sortI(g)">{{g}}</h5>
                </div>
                <br>
                <button class="btn" collapsed="false" style="background-color:transparent; color:#dcdcdc" data-toggle="collapse" href="#languagesCollapse">
                  <h4 class="if-not-collapsed">Languages -</h4>
                  <h4 class="if-collapsed">Languages +</h4>
                </button>
                <br>
                <div class="collapse" id="languagesCollapse">
                  <br>
                  <h5 v-for="l in this.$store.state.languages"
                    v-bind:key="l"
                    @click="sortL(l)">{{l}}</h5>
                </div>
                <br><br>
                <h5>Price Range</h5>
                <slider @clicked="valueSlider"/>
              </div>

            </div>
          </div>
        </div>
        <div class="row col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 text-center">
          <div v-if="this.cards == 0" class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h4 style="margin-left:9rem;margin-right:9rem">Sorry, we can't find a book with this features</h4>
          </div>
            <Card :CardArray="slicedCards" />
          <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 py-5">
            <button type="button" @click="incCardNumber" class="btn btn-outline-secondary btn-lg btn-block">More +</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import slider from './slider.vue'
import Card from './Card.vue'

export default {
  name:'Grid',
  components: {
    slider, Card
  },
  data() {
    return {
      cards: [],
      showCards: 6,
      sortButton: 'DEFAULT'
    }
  },
  created(){
    this.cards = this.it
  },
  computed: {
    it(){
    return this.$store.state.items
    },
    slicedCards(){
      return this.cards.slice(0, this.showCards)
    }
  },
  methods: {
    incCardNumber() {
      return this.showCards += 6
    },
    valueSlider(value) {
      var x = value[0];
      var y = value[1];
      this.cards = this.it.filter((e)=> x < e.price && e.price < y)
    },
    sortDate() {
       this.cards.sort((a, b) => Date.parse(a.publishDate)-Date.parse(b.publishDate))
       return this.sortButton = 'DATE'
    },
    sortPrice() {
       this.cards.sort((a, b) => a.price-b.price)
       return this.sortButton = 'PRICE'
    },
    sortTrend() {
       this.cards.sort((a, b) => Date.parse(a.publishDate)-Date.parse(b.publishDate))
       return this.sortButton = 'TRENDING'
    },
    sortI(name){
      this.cards = this.it.filter((e) => e.genres.includes(name))
    },
    sortL(lang){
      this.cards = this.it.filter((e) => e.language === lang)
    },
    reSet() {
      return this.cards = this.it
    }
  }
  }
</script>

<style>
.container.grid {
  min-height: 60rem;
}

.container.grid a {
  cursor: pointer !important;
}

.btn-light {
  color: black !important;
  background: white;
  border-radius: 0 !important;
  border: 1px solid grey !important;
}
.dropdown-menu{
  background-color: #eee;
  color: #17293b;
}

.dropdown-menu > a:hover{
  background-color: #dae0e5

}

.btn-outline-secondary {
  border-radius: 0 !important;
}

/*search options*/

.card-selector {
  color: #DCDCDC;
  background: #17293b !important;
  box-shadow: 0 8px 6px 0 rgba(0, 0, 0, 0.1), 0 26px 70px 0 rgba(0, 0, 0, 0.69);
}

.search-title h5 {
  cursor: pointer;
}

[data-toggle="collapse"]:not(.collapsed) .if-collapsed {
  display: none;
}
[data-toggle="collapse"].collapsed .if-not-collapsed {
  display: none;
}
</style>
