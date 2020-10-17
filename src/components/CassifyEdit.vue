<template>
  <div class="q-pa-md text-black" style="max-width: 350px">
    <q-list bordered separator>
      <q-item
        v-for="(member, key) in Cassify"
        :key="key"
        class="q-my-sm"
        clickable
        v-ripple
      >
        <!-- <q-item-section avatar>{{ key }}</q-item-section> -->
        <q-item-section>{{ member }}</q-item-section>
      </q-item>
    </q-list>
    <div class="flex row q-gutter-xs">
      <div class="col-8">
        <q-input v-model="addcassify" label="新增分類" outlined />
      </div>
      <div class="col flex">
        <q-btn
          stretch
          class="btn-fixed-width"
          color="primary"
          label="新增"
          @click="addCassifyFn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "",
  data() {
    return {
      number: "",
      addcassify: "",
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {
    ...mapState("phrase", ["Cassify"]),
  },
  methods: {
    ...mapActions("phrase", ["UpdateCassify"]),

    addCassifyFn() {
      let temp = [...this.Cassify];
      temp.push(this.addcassify)
    
    this.addcassify ="" 
    //   console.log(temp);
      this.UpdateCassify(temp)
      this.$emit("listenToChild", false); //回傳關閉視窗;
    },
  },
};
</script>

<style>
</style>
