<template>
  <div>
    <template>
      <div class="q-pa-md q-pt-xl" style="max-width: 400px; margin: 0 auto">
        <q-list bordered class="rounded-borders" dark>
          <q-expansion-item
            expand-separator
            icon="update"
            label="新增"
            class="text-h4 bg-positive"
          >
            <q-card>
              <q-card-section>
                <data-import-add></data-import-add>
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
                <data-import-update></data-import-update>
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
    DataImportAdd: require("src/components/DataImportAdd.vue").default,

    DataImportUpdate: require("src/components/DataImportUpdate.vue").default,
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
