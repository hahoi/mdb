<template>
  <q-page class="flex flex-center" >
    <div @click="$router.push('/PageLoadData20201013').catch(err => { })">
    <img
      alt="行動資料庫"
      src="~assets/quasar-logo-full.svg"           
    >
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
