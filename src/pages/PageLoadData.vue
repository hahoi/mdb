<template>
  <div>
    <q-btn @click="dowork">載入資料</q-btn>
    <div class="q-gutter-md q-mt-md row">
      <q-select
        class="col-5"
        v-model="county"
        :options="counties"
        label="選擇縣市"
        outlined
        clearable
      />
      <q-select
        class="col-5"
        v-model="district"
        :options="subDistricts"
        label="選擇區域"
        outlined
        clearable
        ref="district"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { dbFirestore } from "boot/firebase";

export default {
  name: "",
  data() {
    return {
      county: "",
      district: "",
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {
    ...mapState("phrase", ["professionalTitle", "counties", "districts"]),
  },
  methods: {
    dowork() {},
  },
};
</script>

<style>
</style>
