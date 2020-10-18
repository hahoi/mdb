<template>
  <q-page padding style="max-width: 500px; margin: auto">
    <q-list class="q-mb-md" bordered padding>
      <q-item-label header>設定</q-item-label>

      <q-item tag="label" v-ripple>
        <q-item-section avatar>
          <q-item-label>系統公告</q-item-label>
        </q-item-section>
        <q-item-section >
          <q-input
            v-model="announcement"
            color="blue"
            outlined
            type="textarea"
          />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>進入查詢畫面延遲的秒數</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-input v-model="delay" color="blue" />毫秒
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "",
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters("settings", ["settings"]),
    announcement: {
      get() {
        return this.settings.announcement;
      },
      set(value) {
        this.setAnnouncement(value);
      },
    },
    delay: {
      get() {
        return this.settings.delay;
      },
      set(value) {
        this.setDelay(value);
      },
    },
  },
  methods: {
    ...mapActions("settings", ["setAnnouncement", "setDelay"]),
  },
};
</script>

<style>
</style>
