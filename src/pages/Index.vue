<template>
  <q-page class="flex flex-center column">
    <div v-if="this.settings.announcement.length == 0">
      <div class="" @click="go">
        <img alt="行動資料庫" src="~assets/MDB.png" />
      </div>
      <div
        class="text-h5 text-weight text-center"
        style="font-family: 'Dancing Script', cursive"
      >
        Mobile Data Bank<br />
        <span class="text-caption">V 1.0</span>
      </div>
    </div>
    <div v-else>
      <q-card style="" class=" q-ma-md">
        <q-card-section class="fit flex row items-start text-h6" v-html="this.settings.announcement">
          {{ this.settings.announcement }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "PageIndex",
  mounted() {
    // console.log(this.settings.announcement.length);
      this.setMDB(false);
    setTimeout(() => {
      this.go();
    }, this.settings.delay);
  },
  computed: {
    ...mapGetters("settings", ["settings"]),
  },
  methods: {
    ...mapMutations("LoadData", ["setMDB"]),
    go() {
      this.setMDB(true);
      this.$router.push("/MDB").catch((err) => {});
    },
  },
};
</script>
