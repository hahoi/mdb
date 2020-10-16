<template>
  <q-page style="max-width: 500px; margin: auto">
    <q-list bordered class="rounded-borders">
      <q-item-label header class="text-h6">使用者管理</q-item-label>
      <user-list v-for="item in dbData" :key="item.email" :item="item"> </user-list>
    </q-list>
  </q-page>
</template>

<script>
import { dbFirestore } from "boot/firebase";

export default {
  name: "",
  data() {
    return {
      dbData: [],
    };
  },
  components: {
    UserList: require("components/UserList.vue").default,
  },
  created() {
    dbFirestore
      .collection("MDBUsers")
      .get()
      .then((qs) => {
        qs.forEach((doc) => {
          // console.log(doc.data().name);
          this.dbData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>

<style>
</style>
