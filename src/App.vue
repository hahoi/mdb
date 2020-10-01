<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: 'App',
  methods: {
    ...mapActions("fieldrecord", ["fbReadData"]),
    ...mapActions("phrase", ["readProfessionalTitle"]),
  },
  mounted() {
      this.fbReadData(),
      this.readProfessionalTitle()
	  }
}
</script>
<style >
</style>
