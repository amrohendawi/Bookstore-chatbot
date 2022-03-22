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
            <div class="form-group col-md-4">
                <label for="inputId">ID</label>
                <input v-model="this.information[this.information.length - 1].id" class="form-control" readonly>
            </div>
            <div class="form-group col-md-12">
                <label for="inputEmail4">Name</label>
                <input v-model="this.information[this.information.length - 1].name" class="form-control" readonly>
            </div>
            <div class="form-group col-md-12">
                <label for="inputEmail4">Email</label>
                <input v-model="this.information[this.information.length - 1].email" class="form-control" readonly>
            </div>
        </div>
        <div class="form-group">
            <label for="inputAddress">Straße Hausnummer</label>
            <input v-model="this.information[this.information.length - 1].street" class="form-control" readonly>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="inputPLZ">PLZ</label>
                <input v-model="this.information[this.information.length - 1].plz" class="form-control" readonly>
            </div>
            <div class="form-group col-md-6">
                <label for="inputCity">Ort</label>
                <input v-model="this.information[this.information.length - 1].city" class="form-control" readonly>
            </div>
            <div class="form-group col-md-6">
                <label for="inputSatus">Status</label>
                <input v-model="this.information[this.information.length - 1].state" class="form-control" readonly>
            </div>
        </div>
        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Auftrag stornieren bzw. Buch zurückgeben</button>
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Auftrag stornieren bzw. Buch zurückgeben</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="recipient-name" class="col-form-label">Email</label>
                                <input v-model="deleteMail" type="mail" class="form-control" id="email">
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Auftrag-ID</label>
                                <input v-model="deleteID" type="text" class="form-control" id="id">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Schließen</button>
                        <button type="button" @click="deleteOrder()" class="btn btn-danger">Auftrag stornieren bzw. Buch zurückgeben</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
</template>

<script>
import axios from "axios";

export default {
    name: 'Orderinfo',
    components: {},
    data() {
        return {
            information: [],
            currentBook: [],
            deleteMail: "",
            deleteID: ""
        }
    },
    created: async function () {
        this.information = this.$store.state.orderInfoPage
        this.getCurrentBook()
    },
    methods: {
        getCurrentBook: async function () {
            try {
                const res = await axios
                    .get(`http://localhost:8001/books?isbn=${this.information[this.information.length - 1].isbn}`)
                    .then((res) => res.data);
                this.currentBook = res.list;
            } catch (err) {
                this.error = err.message;
            }
        },
        deleteOrder: async function () {
            try {
                const res = await axios
                    .delete(`http://localhost:8001/orders?email=${this.deleteMail}&id=${this.deleteID}`)
                    .then((res) => res.data);
            } catch (err) {
                this.error = err.message;
            }
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
