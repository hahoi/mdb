<template>
  <div>
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
            @click="reload"
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
              @click="$router.push('/')"
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

            <!-- <q-item clickable @click="visitOurWebsite">
            <q-item-section  avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h5">使用說明</q-item-label>
            </q-item-section>
          </q-item> -->
          </template>
        </q-list>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>

      <q-footer elevated class="bg-white">
        <q-toolbar v-if="mdb">
          <q-toolbar-title>
            <div class="row justify-center">
              <div>
                <!-- <q-btn
                v-if="loggedIn"
                  flat
                  icon="more_vert"
                  color="grey"
                  @click=""
                  size="lg"
                  class="q-my-xs"
                /> -->
              </div>
              <!-- <q-space /> -->

              <div v-if="FindRecordLength > 0" class="text-h6 text-black">
                <div v-if="FieldRecordTotalCount === 0">
                  {{ FindRecordLength }}
                  <span class="text-subtitle1 text-blue-grey-10">筆資料</span>
                </div>
                <div v-else>
                  <template>
                    <div class="flex flex-center row">
                                        {{`共${FieldRecordTotalCount}筆 `}}
                                        <q-btn flat label="繼續載入1000筆" @click="load1000"></q-btn>

                      <!-- <q-pagination
                        v-model="current"
                        color="purple"
                        :max="totalPage"
                        :input="true"
                        :max-pages="6"
                        :boundary-numbers="true"
                      >
                      </q-pagination> -->
                      <!-- 
                    max-pages:一次显示的最大页面链接数； 0表示无限
                    max: 最后一页数（必须大于“ min”）
                     -->
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>


<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { powerRouter } from "../router/routes";
import { openURL } from "quasar";

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
  // watch: {
  //   //點擊設定目前分頁
  //   current() { 
  //     this.setCurrentPage(this.current);
  //   },
  // },
  computed: {
    ...mapState("auth", ["loggedIn", "newMenu", "userData"]),
    ...mapState("LoadData", [
      "FieldReord",
      "tasksDownloaded",
      "mdb",
      "FieldRecordTotalCount",
      "currentPage",
    ]),
    ...mapGetters("LoadData", ["FindRecordLength", "totalPage"]),
  },
  methods: {
    ...mapMutations("LoadData", ["setCurrentPage"]),
    ...mapActions("auth", ["logoutUser"]),
    visitOurWebsite() {
      openURL("https://hahoi.github.io/mdbhelp/");
    },
    load1000(){
      this.setCurrentPage(this.currentPage+1)
      console.log(this.currentPage)
    },
    reload() {
      //更新
      window.location.reload(true);
      //保存最新版本
      // LocalStorage.set("version", this.settings.version);
    },
  },
};
</script>
