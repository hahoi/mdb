<template>
  <q-page style="max-width: 600px">
    <div class="bg-light-blue-2">
      <div class="q-gutter-xs q-ma-xs row no-wrap">
        <q-select
          class="col"
          v-model="flt.county"
          :options="counties"
          label="選擇縣市"
          clearable
          outlined
        />
        <q-select
          class="col"
          v-model="flt.district"
          :options="subDistricts"
          label="選擇區域"
          clearable
          outlined
          ref="district"
        />
      </div>
      <div class="q-gutter-xs q-ma-xs row no-wrap">
        <q-input
          class="col-9"
          bottom-slots
          outlined
          v-model="flt.name"
          label="名字查找(需輸入全名)"
          maxlength="12"
        >
          <template v-slot:append>
            <q-icon
              v-if="flt.name !== ''"
              name="close"
              @click="flt.name = ''"
              class="cursor-pointer"
            />
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          class="col-2"
          style="height: 55px"
          color="deep-orange"
          @click="LoadDbData"
          >GO</q-btn
        >
      </div>
    </div>
    <div class="q-mt-xl" v-if="tasksDownloaded" >
    <show-record></show-record>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { dbFirestore } from "boot/firebase";

export default {
  name: "",
  data() {
    return {
      flt: {
        county: "",
        district: "",
        name: "",
      },
    };
  },
  components: {
    ShowRecord: require("components/ShowRecord.vue").default,
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
    ...mapState("fieldrecord", [
      "filter",
      "tasksDownloaded",
      "district",
      "county",
      "name",
    ]),
    ...mapState("phrase", ["professionalTitle", "counties", "districts"]),

    //縣市鄉鎮二級選單
    subDistricts() {
      // 找到鄉鎮的陣列位置
      let index = this.counties.indexOf(this.flt.county);
      if (this.index !== index) {
        //選擇縣市後要將鄉鎮清空
        this.flt.district = "";
      }
      this.index = index;
      return this.districts[index] || [];
    },
  },
  methods: {
    ...mapMutations("fieldrecord", ["setDistrict", "setCounty", "setName","setTasksDownloaded"]),
    ...mapActions("fieldrecord", ["fbReadData", "setFilter"]),
    ...mapActions("phrase", ["readProfessionalTitle"]),

    //=================
    LoadDbData() {
      this.setDistrict(this.flt.district);
      this.setCounty(this.flt.county);
      this.setName(this.flt.name);
      if (this.flt.name) {
        //選擇名字查找，要將縣市鄉鎮清空
        this.flt.district = "";
        this.flt.county = "";
      }
      this.setTasksDownloaded(false)

      // console.log(this.county,this.district,this.name)
      this.fbReadData()
      this.readProfessionalTitle();
    },
  },
};
</script>

<style>
</style>
