<template>
  <div>
    <template >     

      <div class="q-px-md q-mb-xl q-pb-xl absolute full-width column">
        <search20201012 />
        <!-- <q-scroll-area class="q-scroll-area-tasks">  //FieldReordFiltered -->
        <q-list bordered separator>
          <q-infinite-scroll @load="loadMore" :offset="10">
            <data-bank-list-item
              v-for="(task, key) in showingData"
              :key="key"
              :task="task"
              :id="key"
            ></data-bank-list-item>
            <template
              v-slot:loading
              v-if="this.actualMaxPosition < this.FindRecordLength"
            >
              <div class="row justify-center q-my-md">
                {{ actualMaxPosition }} / {{ FindRecordLength }}
              </div>
              <div class="row justify-center ">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-list>
        <!-- </q-scroll-area> -->
      </div>
    </template>



    <!-- 向上捲動 回到頂部 -->
    <!-- <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller> -->
  </div>
</template>

<script>
import Vue from "vue";

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "",
  data() {
    return {
      dialogAdd: false,
      tasks: [],
      actualMaxPosition: 10,
      timer: null,
      index: 1,
    };
  },
  components: {
    search20201012: require("components/Search20201012.vue").default,
    sort: require("components/Sort.vue").default,
    DataBankListItem: require("components/DataBankListItem.vue").default,
  },
  created() {},
  mounted() {
    // this.readProfessionalTitle();
  },
  watch: {},
  computed: {
    ...mapState("LoadData", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("LoadData", ["FieldReordFiltered", "FindRecordLength"]),
    showingData() {
      let keys = [];
      let showTasks = {};
      let showKeys = [];
      Object.keys(this.FieldReordFiltered).forEach((key) => {
        keys.push(key);
      });
      showKeys = keys.slice(0, this.actualMaxPosition);
      showKeys.forEach((key) => {
        Vue.set(showTasks, key, this.FieldReordFiltered[key]);
      });
      // console.log("showTasks",showTasks);
      return showTasks;
    },
  },
  methods: {
    ...mapMutations("LoadData", ["setCurrentId"]),
    ...mapActions("LoadData", [""]),
    ...mapActions("phrase", ["readProfessionalTitle"]),

    loadMore(index, done) {
      //   console.log("index", index);
      this.timer = setTimeout(() => {
        this.actualMaxPosition += 9;
        done();
      }, 500);
    },
    done() {
      // clearTimeout(this.timer);
    },

  },
};
</script>

<style>
</style>
