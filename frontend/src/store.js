import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
// import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    infoPage: [],
    orderInfoPage: [],
    cartItems: [],
    items: [],
    genres: ['Adult', 'Adventure', 'Drama', 'Fairy Tales', 'Fantasy', 'Fiction',
      'Historical', 'Horror', 'Kids', 'Literature', 'Love', 'Mythology', 'Novels',
      'Philosophy', 'Politics', 'Psychology', 'Religion', 'Romance'],
    languages: ['Arabic', 'Bulgarian', 'Chinese', 'Dutch', 'English', 'French', 'German',
      'Indonesian', 'Italian', 'Japanese', 'Norwegian', 'Persian', 'Polish', 'Portuguese',
      'Romanian', 'Russian', 'Spanish', 'Turkish', 'Urdu']
    // genres: ["Fantasy","Fiction","Epic Fantasy","Adult","Science Fiction Fantasy","High Fantasy","Adventure","Dragons",
    //   "Audiobook","Epic","Classics","Literature","Novels","Russia","Romance","Russian Literature",
    //   "Literary Fiction","20th Century","Historical Fiction","Historical","Medieval","British Literature","Mystery","Short Stories",
    //   "Crime","Detective","Mystery Thriller","Science Fiction","Dystopia","Politics","School","Young Adult",
    //   "Coming Of Age","New York","Book Club","Philosophy","Religion","Spirituality","Buddhism","German Literature",
    //   "Chick Lit","Contemporary","Adult Fiction","Contemporary Romance","Love","Drama","Childrens","Animals",
    //   "Picture Books","Middle Grade","Juvenile","Magic","Thriller","Suspense","Psychology","Read For School",
    //   "American","Paranormal","Angels","Paranormal Romance","Supernatural","Urban Fantasy","Young Adult Fantasy","France",
    //   "Classic Literature","Horror","Kids","Fairy Tales","Steampunk","Arthurian","Mythology"]
  },
  // plugins: [createPersistedState()],
  getters: {
    itemsNumber(state) {  // Cart Component
      return state.cartItems.length
    },
    totalPrice(state) { // Cart Component
      if (state.cartItems.length != 0) {
        return state.cartItems.reduce((a, b) => {
          return (b.price == null) ? a : a + b.price
        }, 0)
      }
    },
    infoLength(state) { // Info Component
      if (state.infoPage.length > 0) {
        return state.infoPage.splice(0, 1)
      }
    }
  },
  mutations: {
    initBooks(state) {
      var count = 5000;
      if (state.items.length === 0) {
        for (var o = 0, l = 100; l < count; o = l, l = l + 1000) {
          axios.get(`http://localhost:8001/books?limit=${l}&offset=${o}`).then(res => {
            state.items = res.data.list;
          });
        }
      }
    },
    inCart(state, n) { // Cart Component
      return state.cartItems.push(n)
    },
    outCart(state, n) { // Cart Component
      let index = state.cartItems.findIndex(x => x.isbn === n)
      return state.cartItems.splice(index, 1)
    },
    addtoInfo(state, n) { // Info Component
      return state.infoPage.push(n)
    },
    addtoOrderInfo(state, n) { // Info Component
      return state.orderInfoPage.push(n)
    }
  },
})
