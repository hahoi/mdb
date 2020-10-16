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
    ...mapActions("auth", ["handleAuthStateChange","getDepartment","getAllRoles"]),
  },
  mounted() {
      this.handleAuthStateChange()
      this.getAllRoles()
	  }
}
</script>
