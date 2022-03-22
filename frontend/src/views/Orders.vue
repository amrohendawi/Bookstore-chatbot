<template>
  <section>
    <div class="container-fluid py-4">
      <div class="row d-flex">
        <div class="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-12 order-sm-0 order-12">
          <img class="img-fluid" src="@/assets/con.jpg" />
        </div>
        <div class="col-12 col-xl-8 col-lg-8 col-md-8 col-sm-12 order-first order-xl-0">
          <h1>Order history</h1>
          <h3 style="color: grey">
            Please enter the E-mail associated with the order
          </h3>
          <form class="form-inline" @submit.prevent>
            <div class="form-group row">
              <button class="col-sm-2 btn btn-light" type="button" @click="getOrders()">
                submit
              </button>
              <div class="col-sm-8">
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  style="margin-left: 10px"
                  required
                />
                <label class="label" for="E-mail">E-mail</label>
              </div>
            </div>
            <div v-if="error">
              {{ error }}
            </div>
          </form>
          <OrdersGrid v-if="show" :ordersArray="orders"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Breadc from "@/Components/BooksPage/Breadc.vue";
import OrdersGrid from "@/Components/OrdersPage/OrdersGrid.vue";
import axios from "axios";

export default {
  components: {
    Breadc,
    OrdersGrid,
  },
  data() {
    return {
      email: "",
      error: null,
      show: false,
      orders: []
    };
  },
  methods: {
    getOrders: async function () {
      try {
        const res = await axios
          .get(`http://localhost:8001/orders?email=${this.email}`)
          .then((res) => res.data);
        this.orders = res;
        this.show = true;
      } catch (err) {
        this.error = err.message;
      }
      this.email = '';
    },
  },
  computed: {
    ordersFound(){
      var isbns = this.orders.map(o => o.isbn);
      return this.$store.state.items.filter(i => isbns.includes(i.isbn));
    }
  },
};
</script>


<style scoped>
form {
  width: 100%;
  padding: 50px 0;
  display: block;
  margin: 0 auto;
}

.form-group {
  width: 100%;
  position: relative;
  margin: 0 0 50px;
}
.form-group label {
  font-weight: 100;
  font-size: 1.5rem;
  color: grey;
  position: absolute;
  transition: 0.5s ease-in-out;
  top: 0px;
  z-index: 0;
}
.form-group input,
.form-group textarea {
  outline: none;
  box-shadow: none;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid #555;
  font-size: 1.4rem;
  font-weight: 100;
  width: 100%;
  height: 40px;
  transition: all 0.5s;
  z-index: 1;
  position: relative;
  border-radius: 0;
  resize: none;
  scroll-behavior: none;
}

.form-group input:valid ~ label,
.form-group input:focus ~ label,
.form-group textarea:valid ~ label,
.form-group textarea:focus ~ label {
  color: #71acd6;
  font-size: 1rem;
  top: -15px;
  transition: all 0.5s;
}

.form-group input:valid,
.form-group input:focus,
.form-group textarea:valid,
.form-group textarea:focus {
  border-color: #71acd6;
}

form button {
  -webkit-transition-duration: 200ms;
  transition-duration: 200ms;
  width: 120px;
  height: 50px;
  font-size: 15px;
  padding: 0px 30px;
  cursor: pointer;
  box-shadow: 0 26px 38px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>