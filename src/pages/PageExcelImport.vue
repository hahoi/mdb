<template>
  <div>
    <template>
      <div class="q-pa-md q-pt-xl" style="max-width: 400px; margin: 0 auto">
        <q-list bordered class="rounded-borders" dark>
          <q-expansion-item
            expand-separator
            icon="update"
            label="匯入"
            class="text-h4 bg-positive"
          >
            <q-card>
              <q-card-section>
                <!-- 匯入 -->
                <data-import></data-import>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <br />
          <br />
          <q-expansion-item
            expand-separator
            icon="delete"
            label="刪除"
            class="text-h4 bg-info"
          >
            <q-card>
              <q-card-section>
                <div class="text-black text-body1">
                  資料匯入有錯誤，或要刪除多筆資料，可利用資料存入的時間，查詢出想要刪除的資料。
                </div>
              </q-card-section>
              <q-card-section>
                <!-- 刪除 -->
                <data-Batch-delete></data-Batch-delete>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </template>
  </div>
</template>
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
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>

<style>
</style>
