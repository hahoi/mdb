<template>
  <q-page>
    <template v-if="tasksDownloaded">
      <div class="row q-my-md">
        <search />
        <sort />
        <q-btn fab icon="add" color="info" @click="addTask" />
      </div>
      <div class="q-px-md q-pb-lg absolute full-width column">
        <!-- <q-scroll-area class="q-scroll-area-tasks">  //FieldReordFiltered -->
        <q-list bordered separator>
          <q-infinite-scroll @load="loadMore" :offset="10">
            <task-list-edit
              v-for="(task, key) in showingData"
              :key="key"
              :task="task"
              :id="key"
            ></task-list-edit>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-list>
        <!-- </q-scroll-area> -->
      </div>
    </template>

    <template v-else>
      <span class="absolute-center">
        <h3>載入資料中請稍後...</h3>
        <q-spinner color="primary" size="8em" />
      </span>
    </template>

    <!-- =======新增資料視窗=========================== -->
    <q-dialog
      v-model="dialogAdd"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="">
        <q-bar class="bg-info" v-close-popup>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup
            >關閉
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <task-add @listenToChild="getChildMsg"></task-add>
        </q-card-section>

        <q-card-section v-close-popup>
          <div class="bg-info">
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>關閉 </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 向上捲動 回到頂部 -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
  </q-page>
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
    };
  },
  components: {
    TaskListEdit: require("components/TaskListEdit.vue").default,
    search: require("components/Search.vue").default,
    sort: require("components/Sort.vue").default,
    TaskAdd: require("components/TaskAdd.vue").default,
  },
  created() {},
  mounted() {    
      this.fbReadData(),
      this.readProfessionalTitle()
  },
  watch: {},
  computed: {
    ...mapState("fieldrecord", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("fieldrecord", ["FieldReordFiltered"]),
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
      // console.log(showTasks);
      return showTasks;
    },
  },
  methods: {
    ...mapMutations("fieldrecord", ["setCurrentId"]),
    ...mapActions("fieldrecord", ["fbReadData"]),
    ...mapActions("phrase", ["readProfessionalTitle"]),

    loadMore(index, done) {
      setTimeout(() => {
        this.actualMaxPosition += 9;
        done();
      }, 1000);
    },
    addTask() {
      this.setCurrentId(""); //先將資料庫中目前的ID清空，不能新增照片
      this.dialogAdd = true;
    },
    getChildMsg(val) {
      this.dialogAdd = val;
    },
  },
};
</script>

<style>
</style>
