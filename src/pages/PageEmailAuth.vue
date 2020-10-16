<template>
  <q-page padding class="flex column">
    <q-card class="auth-tabs">
      <q-tabs
        v-model="tab"
        
        class="bg-grey-4 text-black"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" class="text-h6" >登入</q-tab>
        <q-tab name="register"   class="text-h6">註冊</q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <login :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <register :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      tab: "login",
    };
  },
  components: {
    "login": require("components/Login.vue").default,
    "register": require("components/Register.vue").default,
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>

<style>
.auth-tabs {
  max-width: 400px;
  width: 100%;
  margin: 5vw auto;
}
</style>
