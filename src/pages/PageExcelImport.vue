<template>
  <div>
    <div class="q-pa-xl" style="max-width: 450px; margin: 0 auto">
      <q-list bordered>
        <q-expansion-item
          group="somegroup"
          icon="update"
          label="從 Excel檔 匯入"
          default-opened
          header-class="bg-secondary text-white text-h5"
          expand-icon-class="text-white"
        >
          <q-card>
            <q-card-section
              ><!-- 匯入 -->
              <data-import></data-import>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item
          group="somegroup"
          icon="highlight_off"
          label="刪除多筆資料"
          header-class="bg-red text-white text-h5"
          expand-icon-class="text-white"
        >
          <q-card>
            <q-card-section>
              <div class="text-black text-body1">
                資料匯時發生錯誤，或是有多筆資料要刪除，可利用資料存入(更新)的時間，查詢出想要刪除的資料。
              </div>
            </q-card-section>
            <q-card-section>
              <!-- 刪除 -->
              <data-Batch-delete></data-Batch-delete>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- <q-separator />

        <q-expansion-item
          group="somegroup"
          icon="cloud_download"
          label="備份"
          header-class="bg-info text-white text-h5"
          expand-icon-class="text-white"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem,
              eius reprehenderit eos corrupti commodi magni quaerat ex numquam,
              dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item
          group="somegroup"
          icon="settings_backup_restore"
          label="還原"
          header-class="bg-teal text-white  text-h5"
          expand-icon-class="text-white"
        >
          <q-card class="bg-teal-2">
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem,
              eius reprehenderit eos corrupti commodi magni quaerat ex numquam,
              dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item> -->
      </q-list>
    </div>
  </div>
</template>
  

<script>
export default {
  name: "Import",
  data() {
    return {};
  },
  components: {
    DataImport: require("src/components/DataImport.vue").default,

    DataBatchDelete: require("src/components/DataBatchDelete.vue").default,
  },
  created() {
          //  判斷設備
      if (this.$q.platform.is.mobile) {
        // console.log("mobile")
        this.$q
          .dialog({
            title: "提示",
            message: "請在電腦上操作匯入匯出。",
            // persistent: true,
          })
          .onOk(() => {
          })
      }

  },
  mounted() {
  },
  watch: {},
  computed: {},
  methods: {},
};
</script>

<style>
</style>
