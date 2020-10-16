<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="loggedIn"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title
          class="flex justify-center text-center text-weight text-h5"
        >
          行動資料庫
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="loggedIn"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <template v-if="newMenu.length === 0">
          <q-item>
            <q-item-label>尚未設定使用此系統，請洽系統管理員！</q-item-label>
          </q-item>
        </template>
        <template v-else>
          <q-item-label
            header
            class="text-grey-8 fit row justify-start items-center bg-brown-1"
          >
            <img alt="行動資料庫" src="~assets/MDB64.png" />
            <div
              class="text-weight text-h5 q-ml-md"
              style="font-family: 'Dancing Script', cursive"
            >
              Mobile Data Bank
            </div>
          </q-item-label>
          <q-separator />
          <q-item class="bg-brown-1">
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>
            <q-item-section class="text-h5">
              {{ userData.name }}
            </q-item-section>
            <q-item-section side>
              <q-btn push label="登出" color="cyan" @click="logoutUser" />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item-label class="q-ma-md"> </q-item-label>
          <EssentialLink
            v-for="link in newMenu"
            :key="link.title"
            v-bind="link"
          />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { powerRouter } from "../router/routes";

export default {
  name: "MainLayout",
  components: {
    EssentialLink: require("components/EssentialLink.vue").default,
  },
  data() {
    return {
      leftDrawerOpen: false,
      // essentialLinks: linksData,
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "newMenu", "userData"]),
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
  },
};
</script>
