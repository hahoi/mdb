<template>
  <q-page class="flex flex-center column">
    
    <div class="" @click="go">
      <img alt="行動資料庫" src="~assets/MDB.png" />
    </div>
    <div
      class="text-h5 text-weight "
      style="font-family: 'Dancing Script', cursive"
    >
      Mobile Data Bank
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  mounted() {
    setTimeout(() => {
        this.go()
      }, 3000);
  },

  methods: {
    go() {
      this.$router.push("/MDB").catch((err) => {});
    },
  },
}
</script>
