<template>
<div class="container py-5" style="padding-top:70px;">
    <div class="row">
        <div class="col3 col-xl-3 col-lg-3 col-md-3 col-sm-3">
            <img class="img-fluid" :src="currentBook[0].coverImg">
        </div>
        <div class="col9 col-xl-9 col-lg-9 col-md-9 col-sm-9">
            <div class="col6 col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex align-items-center justify-content-start">
                <div class="info pt-xl-0 pt-lg-0 pt-5">
                    <h1 class="font-weight-bold text-uppercase pt-3">{{ currentBook[0].title }}</h1>
                    <br><br>
                    <h4>price: ${{ currentBook[0].price }}</h4>
                    <br>
                    <h4>ISBN: {{ currentBook[0].isbn }}</h4>
                    <br><br>
                </div>
            </div>
        </div>
    </div>
    <br>
    <form>
        <div class="form-row">
            <div class="form-group col-md-12">
                <label>Name</label>
                <input v-model="processName" class="form-control">
            </div>
            <div class="form-group col-md-12">
                <label for="inputEmail4">Email</label>
                <input type="text" v-model="processEmail" class="form-control">
            </div>
        </div>
        <div class="form-group">
            <label for="inputAddress">Straße Hausnummer</label>
            <input type="text" v-model="processStreet" class="form-control">
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="inputPLZ">PLZ</label>
                <input type="text" v-model="processPLZ" class="form-control">
            </div>
            <div class="form-group col-md-6">
                <label for="inputCity">Ort</label>
                <input type="text" v-model="processCity" class="form-control">
            </div>
        </div>
        <button v-if="this.postResponse.length==0" type="button" class="btn btn-success" @click="doOrder()">Bestellung abscließen</button>
    </form>

    <div v-if="this.postResponse.length>5" class="alert alert-danger" role="alert" >
        Leider hat es nicht geklappt: {{this.postResponse}}
    </div>
    <div v-if="this.postResponse.length==5" class="alert alert-success" role="alert" >
        Super! Deine Bestellung hat die folgende ID: {{this.postResponse}}
    </div>
     
</div>
</template>

<script>
import axios from "axios";

export default {
    name: 'orderinfo',
    components: {},
    data() {
        return {
            information: [],
            currentBook: [],
            processName: "",
            processEmail: "",
            processStreet: "",
            processPLZ: "",
            processCity: "",
            postResponse: ""
        }
    },
    created: async function () {
        this.currentBook = this.$store.state.cartItems
    },
    methods: {
        doOrder: async function () {
            try {
                const res = await axios
                    .post(`http://localhost:8001/orders?name=${this.processName}&street=${this.processStreet}&plz=${this.processPLZ}&city=${this.processCity}&email=${this.processEmail}&isbn=${this.currentBook[0].isbn}`)
                    .then((res) => res.data);
                    this.postResponse = res
                    if (res["application/json"]){
                        this.postResponse = res["application/json"][0]["id"]
                    }
                    if (res[0]["error"]){
                        this.postResponse = res[0]["error"]
                    }
                    
                    
            } catch (err) {
                this.error = err.message;
            }
            this.$store.state.cartItems = []

        }
    }
}
</script>

<style scoped>
hr {
    width: 50px;
    border-bottom: 1px solid black;
}
</style>
