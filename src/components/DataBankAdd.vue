<template>
  <div class="bg-grey-1" style="max-width: 600px; margin: auto">
    <q-form ref="form" @submit.prevent="onSubmit" @reset="onReset">
      <div class="bg-cyan" v-if="dialogTab">
        <q-tabs
          v-model="tab"
          class="text-white"
          active-color="yellow"
          indicator-color="purple"
          align="justify"
          narrow-indicator
        >
          <q-tab name="information" class="text-h5" label="基本資料" />
          <q-tab name="Suggestions" label="見面記事" />
          <q-tab name="other" label="其它" />
        </q-tabs>

        <!-- <q-separator /> -->

        <q-tab-panels v-model="tab" animated class="">
          <q-tab-panel name="information" class="col">
            <div class="q-ma-md row items-start">
              <q-input
                v-model="data.name"
                label="姓名"
                lazy-rules
                :rules="[(val) => !!val || '* 這個欄位必須要輸入']"
                outlined
              />
            </div>
            <div class="row q-ma-md row items-start">
              <div class="col q-mr-md">
                <q-input v-model="data.mobilePhone" label="手機" outlined />
              </div>
              <div class="col">
                <q-input
                  v-model="data.companyPhone"
                  label="公司電話"
                  outlined
                />
              </div>
            </div>
                <!-- :rules="[(val) => isValidEmailAddress(val) || '不合格式的 e-mail.']" -->
            <div class="q-ma-md row items-start">
              <q-input
                v-model="data.email"
                label="Email"
                lazy-rules
                outlined
              />
            </div>
            <div class="q-ma-md row">
              <q-select
                class="col q-mr-md"
                v-model="data.county"
                :options="counties"
                label="選擇縣市"
                outlined
                ref="county"
                popup-content-class="text-h6"
              />
              <q-select
                class="col"
                v-model="data.district"
                :options="subDistricts"
                label="選擇區域"
                outlined
                clearable
                ref="district"
                popup-content-class="text-h6"
              />
            </div>
            <div class="q-ma-md row items-start">
              <q-input v-model="data.address" label="地址" outlined />
            </div>

            <div class="q-ma-md row items-start">
              <q-select
                class="col"
                v-model="data.classify"
                :options="Cassify"
                label="分類"
                outlined
                popup-content-class="text-h6"
              />
              <div class="flex col q-ml-md">
                <q-btn
                  color="white"
                  text-color="black"
                  stretch
                  label="編輯分類"
                  @click="dialogCassify = true"
                  @listenToChild="dialogCassify = false"
                />
              </div>
            </div>

            <div class="q-ma-md row items-start">
              <q-input v-model="data.proTitle" label="職業職稱" outlined />
            </div>

            <div class="q-ma-md row items-start">
              <q-input v-model="data.clubTitle" label="社團職稱" outlined />
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="data.personalConnections"
                label="人脈關係"
                outlined
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="Suggestions">
            <div class="q-gutter-md q-ma-md">
              <q-input
                v-model="data.meetNotes"
                label="見面記事"
                autogrow
                outlined
                type="textarea"
                :input-style="{ 'font-size': '18px' }"
              />
            </div>
            <div class="q-gutter-md q-ma-md">
              <q-input
                v-model="data.suggestions"
                label="建言事項"
                autogrow
                outlined
                type="textarea"
                :input-style="{ 'font-size': '18px' }"
              />
            </div>
            <div class="q-gutter-md q-ma-md">
              <q-input
                v-model="data.petitionMatters"
                label="陳情事項"
                autogrow
                outlined
                type="textarea"
                :input-style="{ 'font-size': '18px' }"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="other">
            <div class="q-ma-md row items-start">
              <q-input v-model="data.diet" label="飲食" outlined />
            </div>
            <div class="q-ma-md row items-start">
              <q-input v-model="data.interest" label="興趣" outlined />
            </div>
            <div class="q-ma-md row items-start">
              <q-input v-model="data.topic" label="話題" outlined />
            </div>
            <div class="q-ma-md row items-start">
              <q-input v-model="data.other" label="其他" outlined />
            </div>
            <div class="q-gutter-md q-ma-md row items-start">
              <q-rating
                v-model="data.star"
                size="2em"
                :max="5"
                color="primary"
                icon="star_border"
                icon-selected="star"
              />

              <div v-if="data.RedDot" @click="toggle">
                <q-icon
                  name="brightness_1"
                  class="text-red"
                  style="font-size: 2rem"
                />
              </div>
              <div v-else @click="toggle">
                <q-icon
                  name="panorama_fish_eye"
                  class="text-red"
                  style="font-size: 2rem; outline"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <q-card-actions align="around" class="bg-white">
          <q-space />

          <q-btn
            label="存檔"
            type="submit"
            color="primary"
            icon="save"
            class="btn-fixed-width"
          />
        </q-card-actions>
      </div>
    </q-form>

    <div class="" style="max-width: 600px">
      <!-- v-if="currentId" -->

      <q-card-section v-if="currentId"
        >上傳照片
        <template>
          <div class="q-pa-md">
            <q-stepper v-model="step" vertical color="primary" animated>
              <q-step :name="1" title="選擇照片" icon="add" :done="step > 1">
                <input
                  id="inputimage"
                  ref="fileInput"
                  type="file"
                  @change="handleFileSelect"
                  style="display: none"
                  accept="image/*, .pdf"
                />
                <q-stepper-navigation>
                  <!-- <q-btn @click="step = 2" color="primary" label="下一步" /> -->
                  <q-btn color="primary" @click="$refs.fileInput.click()"
                    >按我選擇照片</q-btn
                  >
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="預覽照片"
                icon="create_new_folder"
                :done="step > 2"
              >
                <div v-for="(item, key) in imageFiles">
                  <!-- {{ item.filename }} -->
                  <div>
                    <q-img
                      :src="item.imageDataUrl"
                      style="max-width: 100px"
                    ></q-img>
                  </div>
                  <!-- <pre>{{item.EXIF}}</pre> -->
                </div>

                <q-stepper-navigation>
                  <q-circular-progress
                    :min="40"
                    :max="70"
                    :value="uploadProgress"
                    size="50px"
                    :thickness="0.22"
                    color="teal"
                    track-color="grey-3"
                    class="q-ma-sm"
                  />
                  <q-btn
                    @click="uploadImage"
                    color="primary"
                    label="上傳照片"
                  />
                  <q-btn
                    flat
                    @click="step = 1"
                    color="primary"
                    label="重選照片"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>
              <q-step :name="3" title="完成" icon="add_comment">
                <q-stepper-navigation>
                  <q-btn
                    @click="step = 1"
                    color="primary"
                    label="繼續上傳"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </div>
        </template>
        <!-- <div
          class="fit row wrap justify-end items-center bg-cyan"
          style="margin: 0; padding: 0"
        >
          <div class="q-ma-xs">
            <q-btn
              label="繼續新增"
              type="submit"
              color="primary"
              @click="KeepAdd"
            />
          </div>
          <div class="q-ma-xs">
            <q-btn
              label="離開"
              color="primary"
              class="bg-accent text-white"
              flat
              @click="goAway"
            />
          </div>
        </div> -->
      </q-card-section>
    </div>

    <!-- :maximized="true" -->

    <!-- 編輯分類視窗============================== -->
    <q-dialog
      v-model="dialogCassify"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1 text-white">
        <q-bar>
          <q-btn flat icon="close" v-close-popup class="bg-black text-white"
            >離開
          </q-btn>
          <q-space />
        </q-bar>

        <q-card-section>
          <cassify-edit />
        </q-card-section>
        <q-card-section>
          <q-btn
            flat
            icon="close"
            v-close-popup
            class="bg-black text-white"
            size="sm"
            >離開
          </q-btn>
          <q-space />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>



<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { dbFirestore, dbStorage } from "boot/firebase";
import com_fun from "src/utils/function";
import EXIF from "src/utils/exif.min.js";

export default {
  name: "",
  data() {
    return {
      dialogCassify: false,
      dialogTab: true,
      tab: "information", // tab 預設顯示
      splitterModel: 20,

      data: {
        name: "",
        mobilePhone: "",
        companyPhone: "",
        avatar: "",
        photo: [],
        county: "",
        district: "",
        address: "",
        classify: "",
        proTitle: "",
        professionalTitle: "",
        clubTitle: "",
        personalConnections: "",
        meetNotes: "",
        suggestions: "",
        petitionMatters: "",
        diet: "",
        interest: "",
        topic: "",
        other: "",
        update: "",
        star: 0,
        email: "",
        zip: "",
        RedDot: false,
        updateDate: null,
      },

      step: 1,

      imageFiles: [], //儲存上傳檔案資訊，含imageDataUrl（base64Url格式）
      uploadProgress: 0,
      index: -1,
      clearData: {},
      uploadPhotoArray: [],
    };
  },
  components: {
    CassifyEdit: require("components/CassifyEdit.vue").default,
  },
  created() {
    // this.readProfessionalTitle();
    // this.ReadCassify()
  },
  mounted() {
    //畫面顯示資料先清除
    this.clearFieldReord();
    this.clearData = Object.assign({}, this.data);
    this.setCurrentId("");
    this.dialogTab = true;
    this.step = 1;
    this.tab = "information";
    this.setSearch("");
  },
  watch: {},
  computed: {
    ...mapState("LoadData", ["currentId"]),
    ...mapState("phrase", [
      "professionalTitle",
      "Cassify",
      "counties",
      "districts",
    ]),
    subDistricts() {
      let index = this.counties.indexOf(this.data.county);
      // console.log(this.index, index,this.index !== index)
      // this.$nextTick(() => {
      if (this.index !== index) {
        // this.$refs.district.value = "";
        this.data.district = "";
        // console.log("要改變")
      }
      // });
      this.index = index;
      return this.districts[index] || [];
    },
  },
  methods: {
    ...mapMutations("LoadData", [
      "clearFieldReord",
      "setCurrentId",
      "setFieldRecordPhoto",
      "setSearch",
    ]),
    ...mapActions("LoadData", ["addFieldRecord", "updateFieldRecord"]), //上傳圖片要特處理
    ...mapActions("phrase", ["readProfessionalTitle", "ReadCassify"]),
    //切換紅點
    toggle() {
      this.data.RedDot = !this.data.RedDot;
      console.log(this.data.RedDot);
    },
    //關閉編輯分類視窗  
    getChildMsg(val) {
      this.dialogCassify = val;
    },

    goAway() {
      this.setCurrentId("");
      // this.$router.replace('/').catch(err => { })
      this.$router.go(-1);
    },

    isValidEmailAddress(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    onSubmit() {
      this.$refs.form.validate().then((success) => {
        if (this.data.name.trim() === "") {
          this.$q.dialog({
            title: "錯誤",
            message: "名字不能空白",
          });
          return false;
        }

        if (this.data.county.trim() === "") {
          this.$q.dialog({
            title: "提示",
            message: "請選擇縣市",
          });
          return false;
        }

        // if (this.data.classify.trim() === "") {
        //   this.$q.dialog({
        //     title: "提示",
        //     message: "請選擇分類",
        //   });
        //   return false;
        // }

        if (success) {
          //檢查欄位規則是正确的

          this.data.updateDate = new Date();
          // console.log(this.data);

          //拷貝一份，存入資料庫
          let copyData = Object.assign({}, this.data);
          this.addFieldRecord(copyData);
          this.$q.notify("存檔中...");

          //把基本資料Tab視窗關閉，後續上傳圖片
          this.dialogTab = false;

          //關閉緩存
          // this.$route.meta.keepAlive = true
        } else {
          console.log("檢查欄位規則錯誤");
        }
      });
    },
    onReset() {
      this.$refs.form.validate();
      this.$emit("listenToChild", false); //回傳關閉視窗;
    },
    KeepAdd() {
      this.data = Object.assign({}, this.clearData);
      this.setCurrentId("");
      this.dialogTab = true;
      this.step = 1;
      this.tab = "information";
    },

    // ======================== 選擇佐證資料、照片======================================
    handleFileSelect(e) {
      let vm = this;
      let Orientation = null;
      // console.log("e",!e.target.files,e.target.files)
      // console.log("w",!window.FileReader,window.FileReader)

      if (!e.target.files || !window.FileReader) return;
      let files = e.target.files;
      let filesArr = Array.prototype.slice.call(files);

      // console.log(filesArr)
      const file = filesArr[0];

      vm.uploadProgress = 0; //上傳圖形進度
      this.imageFiles = []; //圖片螢幕顯示部分，需清除

      //=====================處理圖片=====================
      filesArr.forEach(function (file, i) {
        if (!file.type.match("image.*")) {
          return;
        }
        vm.imageFiles.unshift({
          filename: "", //照片檔名
          imageDataUrl: "", //base64Url
          EXIF: {},
          discription: "", //照片描述
          GPSLatitude: 0, //緯度
          GPSLongitude: 0, //經度
          // GPSLatitudeRef: "",		//南北緯 N北緯 S南緯
          // GPSLongitudeRef: ""		//東西經 E東經 W西經
        });

        let reader = new FileReader();
        let image = new Image();
        // const EXIF = require("exif").ExifImage;

        EXIF.getData(file, function () {
          Orientation = EXIF.getTag(this, "Orientation");
          //   console.log(Orientation);
          //   vm.imageFiles[i].EXIF = EXIF.getAllTags(this);
          //   console.log(EXIF.getAllTags(this));
          let lat_ref = EXIF.getTag(this, "GPSLatitudeRef");
          let lat = EXIF.getTag(this, "GPSLatitude");

          let lng_ref = EXIF.getTag(this, "GPSLongitudeRef");
          let lng = EXIF.getTag(this, "GPSLongitude");

          if (
            lat_ref != undefined &&
            lng_ref != undefined &&
            lng != undefined &&
            lng != undefined
          ) {
            vm.imageFiles[i].GPSLatitude =
              lat_ref == "N"
                ? com_fun.change_latlng(lat)
                : com_fun.change_latlng(lat) * -1;
            vm.imageFiles[i].GPSLongitude =
              lng_ref == "E"
                ? com_fun.change_latlng(lng)
                : com_fun.change_latlng(lng) * -1;
          }
        });

        reader.onload = function (ev) {
          image.src = ev.target.result;
          image.onload = function () {
            let imgWidth = this.width,
              imgHeight = this.height;

            if (imgWidth > imgHeight && imgWidth > 750) {
              imgWidth = 750;
              imgHeight = Math.ceil((750 * this.height) / this.width);
            } else if (imgWidth < imgHeight && imgHeight > 1334) {
              imgWidth = Math.ceil((1334 * this.width) / this.height);
              imgHeight = 1334;
            }

            let canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            if (Orientation && Orientation != 1) {
              switch (Orientation) {
                case 6:
                  canvas.width = imgHeight;
                  canvas.height = imgWidth;
                  ctx.rotate(Math.PI / 2);
                  ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
                  break;
                case 3:
                  ctx.rotate(Math.PI);
                  ctx.drawImage(
                    this,
                    -imgWidth,
                    -imgHeight,
                    imgWidth,
                    imgHeight
                  );
                  break;
                case 8:
                  canvas.width = imgHeight;
                  canvas.height = imgWidth;
                  ctx.rotate((3 * Math.PI) / 2);
                  ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
                  break;
              }
            } else {
              ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
            }
            vm.imageFiles[i].imageDataUrl = canvas.toDataURL("image/jpeg", 0.8); //save 壓縮過的檔案
            vm.imageFiles[i].filename =
              file.name == "image.jpg"
                ? Math.floor(Date.now() / 1000) + ".jpg"
                : Math.floor(Date.now() / 1000) + file.name;
            //iPhone會產生image.jpg檔名，改唯一編碼
            // console.log(vm.imageFiles);
          };
        };
        // 圖片壓縮完顯示在螢幕
        reader.readAsDataURL(file);
      });
      // 跳到步驟2，因不是callback情況，所以放在迴圈外
      this.step = 2;
    },

    //=============上傳圖片、照片檔案======================
    uploadImage() {
      let vm = this;
      let imageFiles = vm.imageFiles;
      let metadata = { contentType: "image/jpeg" };
      vm.uploadProgress = 0; //上傳圖形進度

      imageFiles.forEach((item, index, array) => {
        // Upload file and metadata to the object 'images/mountains.jpg'
        let uploadTask = dbStorage
          .ref()
          .child("/現場紀錄表/" + this.currentId + "/" + item.filename)
          .putString(item.imageDataUrl, "data_url");
        uploadTask.on(
          "state_changed",
          function (snapshot) {
            //非同步處理
            vm.uploadProgress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          function (error) {
            //firebase storage 需要驗證
            //write: if request.auth != null; ，有驗證，可以寫入
            console.log(error);
            alert("上傳圖片有錯誤！");
          },
          function () {
            //成功
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              // vm.propData4.cfmpic = downloadURL;
              let linkURL = downloadURL; //link URL
              let findKey = "/現場紀錄表/" + vm.currentId + "/" + item.filename; //find 鍵值
              vm.imageFiles = []; //螢幕顯示部分，上傳完畢后，需清除
              let data = {
                linkURL: linkURL,
                findKey: findKey,
                // avatar: false,
              };

              // vm.data.photo.push(data); 這樣會出錯
              //pure push copy
              vm.data.photo = [...vm.data.photo, data];

              vm.data.avatar = vm.data.photo[0].linkURL; //第一張照片設為頭像
              // console.log(vm.data.avatar)
              vm.data.updateDate = new Date();
              // 存入照片資料
              //   vm.data.photo[0].avatar = true; //第一張照片設為頭像
              console.log(vm.data);
              let payload = {
                id: vm.currentId,
                data: vm.data, //要更新所有欄位，否則在更新state時，因是全物件更新，所以會出錯
              };
              //跳下一步
              vm.step = 3;

              //=============存入資料庫======================
              return vm.updateFieldRecord(payload);
            });
          }
        );
      });
    },
  },
};
</script>

<style>
.q-tab__label,
input {
  font-size: 18px;
}
.btn-fixed-width {
  width: 200px;
}
</style>
