<template>
  <q-page>
    <template v-if="tasksDownloaded">
      <div class="row q-my-md">
        <search />
        <sort />
        <q-btn fab icon="add" color="info" @click="addTask" />
      </div>
      <div class="q-px-md q-pb-lg absolute full-width column">
        <!-- <q-scroll-area class="q-scroll-area-tasks"> -->
        <q-list bordered separator>
          <task-list-edit
            v-for="(task, key) in FieldReordFiltered"
            :key="key"
            :task="task"
            :id="key"
          ></task-list-edit>
        </q-list>
        <!-- </q-scroll-area> -->
      </div>
    </template>

    <template v-else>
      <span class="absolute-center">
        <q-spinner color="primary" size="3em" />
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
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "",
  data() {
    return {
      dialogAdd: false,
    };
  },
  components: {
    TaskListEdit: require("components/TaskListEdit.vue").default,
    search: require("components/Search.vue").default,
    sort: require("components/Sort.vue").default,
    TaskAdd: require("components/TaskAdd.vue").default,
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
    ...mapState("fieldrecord", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("fieldrecord", ["FieldReordFiltered"]),
  },
  methods: {
    ...mapMutations("fieldrecord", ["setCurrentId"]),
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
