<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "App",
  methods: {
    // ...mapActions("search", ["LoadSaveAllData"]),
    // ...mapActions("phrase", ["readProfessionalTitle"]),
  },
  mounted() {
    // this.LoadSaveAllData();
    // this.readProfessionalTitle()
  },
};
</script>
<style >
</style>
