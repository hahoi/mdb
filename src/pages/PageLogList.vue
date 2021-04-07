<template>
  <div class="q-ma-md" >
    <template v-for="(item, key) in logData" >
      <div class="row">
        <div class="col">
          {{ item.date }}
        </div>
        <div class="col">
          {{ item.name }}
        </div>
        <div class="col">
          {{ item.do }}
        </div>
        <div class="col ellipsis">
          {{ item.data }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { dbFirestore } from "boot/firebase";
import { date } from "quasar";
export default {
  name: "",
  data() {
    return {
      logData: [],
    };
  },
  components: {},
  created() {
    dbFirestore
      .collection("log")
      .orderBy("date", "desc")
      .limit(1000)
      .get()
      .then((qs) => {
        qs.forEach((doc) => {
          // console.log(doc.data().name);
          let x = doc.data();
          let data = {
            date: date.formatDate(x.date.toDate(), "YYYY-MM-DD HH:mm:ss"),
            name: x.name,
            do: x.do,
            data: x.data,
          };
          this.logData.push(data);
        });
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
