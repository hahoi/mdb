<template>
  <div class="bg-white" style="max-width: 600px; margin: auto" v-if="dialogTab">
    <q-form ref="form" @submit.prevent="onSubmit" @reset="onReset">
      <q-tabs
        v-model="tab"
        class="text-grey text-caption bg-indigo"
        active-color="white"
        indicator-color="purple"
        align="justify"
        narrow-indicator
      >
        <q-tab name="information" label="基本資料" />
        <q-tab name="Suggestions" label="見面記事" />
        <q-tab name="other" label="其它" />
        <q-tab name="uploadPhoto" label="上傳照片" />
      </q-tabs>

      <!-- <q-separator /> -->

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="information">
          <div class="q-ma-md row items-start">
            <div class="col-2">
              <q-avatar v-if="task.photo.length > 0">
                <img :src="task.avatar" />
              </q-avatar>
            </div>
            <div class="col-10">
              <q-input
                v-model="task.name"
                label="姓名"
                lazy-rules
                :rules="[(val) => !!val || '* 這個欄位必須要輸入']"
                outlined
              />
            </div>
          </div>
          <div class="row q-ma-md row items-start">
            <div class="col q-mr-md">
              <q-input v-model="task.mobilePhone" label="手機" outlined />
            </div>
            <div class="col">
              <q-input v-model="task.companyPhone" label="公司電話" outlined />
            </div>
          </div>

          <!-- :rules="[(val) => isValidEmailAddress(val) || '不合格式的 e-mail.',]" -->
          <div class="q-ma-md row items-start">
            <q-input v-model="task.email" label="Email" lazy-rules outlined />
          </div>
          <div class="q-ma-md row">
            <q-select
              class="col q-mr-md"
              v-model="task.county"
              :options="counties"
              label="選擇縣市"
              outlined
              clearable
              popup-content-class="text-h6"
            />
            <q-select
              class="col"
              v-model="task.district"
              :options="subDistricts"
              label="選擇區域"
              outlined
              clearable
              ref="district"
              popup-content-class="text-h6"
            />
          </div>
          <div class="q-ma-md row items-start">
            <q-input v-model="task.address" label="地址" outlined />
          </div>

          <div class="q-ma-md row items-start">
            <q-select
              class="col"
              v-model="task.classify"
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
            <q-input v-model="task.proTitle" label="職業職稱" outlined />
          </div>

          <div class="q-ma-md row items-start">
            <q-input v-model="task.clubTitle" label="社團職稱" outlined />
          </div>
          <div class="q-ma-md row items-start">
            <q-input
              v-model="task.personalConnections"
              label="人脈關係"
              outlined
            />
          </div>
        </q-tab-panel>
        <q-tab-panel name="Suggestions">
          <div class="q-ma-md">
            <q-input
              v-model="task.meetNotes"
              label="見面記事"
              autogrow
              outlined
              type="textarea"
              :input-style="{ 'font-size': '18px' }"
            />
          </div>
          <div class="q-ma-md">
            <q-input
              v-model="task.suggestions"
              label="建言事項"
              autogrow
              outlined
              type="textarea"
              :input-style="{ 'font-size': '18px' }"
            />
          </div>
          <div class="q-ma-md">
            <q-input
              v-model="task.petitionMatters"
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
            <q-input v-model="task.diet" label="飲食" outlined />
          </div>
          <div class="q-ma-md row items-start">
            <q-input v-model="task.interest" label="興趣" outlined />
          </div>
          <div class="q-ma-md row items-start">
            <q-input v-model="task.topic" label="話題" outlined />
          </div>
          <div class="q-ma-md row items-start">
            <q-input v-model="task.other" label="其他" outlined />
          </div>

          <div class="q-gutter-md q-ma-md row items-start">
            <q-rating
              v-model="task.star"
              size="2em"
              :max="5"
              color="primary"
              icon="star_border"
              icon-selected="star"
            />

            <div v-if="task.RedDot" @click="toggle">
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

        <q-tab-panel name="uploadPhoto">
          <!-- <div> 不使用
            <q-uploader :factory="factoryFn" style="max-width: 250px" />
          </div> -->
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

            <q-list>
              <q-item clickable v-if="task.photo.length !== 0">
                <q-item-section top thumbnail class="q-ml-none">
                  <div
                    v-for="(img, key) in task.photo"
                    class="col text-black q-mb-md vertical-middle"
                  >
                    <span @click="delPhoto(img, key)">
                      <q-icon name="delete" /><q-icon name="close" /></span
                    ><br />
                    <img :src="img.linkURL" class="vertical-middle" />
                    <q-btn flat @click="setAvatar(img.linkURL)">設為頭像</q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- ============================================ -->
      <q-card-actions align="around" v-if="tab !== 'uploadPhoto'">
        <q-space />
        <q-btn
          label="存檔"
          type="submit"
          color="primary"
          icon="save"
          class="btn-fixed-width"
        />
      </q-card-actions>
      <!-- </q-card> -->
    </q-form>

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
  props: ["task", "id"],
  data() {
    return {
      dialogCassify: false,
      dialogTab: true,
      tab: "information", // tab 預設顯示
      splitterModel: 20,

      step: 1,

      imageFiles: [], //儲存上傳檔案資訊，含imageDataUrl（base64Url格式）
      uploadProgress: 0,
      first: true,
      index: -1,
    };
  },
  components: {
    CassifyEdit: require("components/CassifyEdit.vue").default,
  },
  created() {
    // this.readProfessionalTitle();
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapState("auth", ["userData"]),
    ...mapState("LoadData", ["currentId"]),
    ...mapState("phrase", [
      "professionalTitle",
      "counties",
      "districts",
      "Cassify",
    ]),
    subDistricts() {
      let index = this.counties.indexOf(this.task.county);
      if (this.index !== index) {
        if (this.index !== -1) {
          //第一次載入時不改變
          this.task.district = "";
        }
      }
      this.index = index;
      return this.districts[index] || [];
    },
  },
  methods: {
    // ...mapMutations("fieldrecord", ["setCurrentId"]),
    ...mapActions("LoadData", ["updateFieldRecord"]),
    ...mapActions("phrase", ["readProfessionalTitle", "ReadCassify"]),
    //切換紅點
    toggle() {
      this.task.RedDot = !this.task.RedDot;
      console.log(this.task.RedDot);
    },

    isValidEmailAddress(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },

    //刪除照片
    delPhoto(img, key) {
      let vm = this;

      this.$q
        .dialog({
          title: "刪除確認",
          message: `要刪除這張照片嗎？`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          //從遠端儲存空間刪除
          let findKey = this.task.photo[key].findKey;
          let uploadTask = dbStorage.ref().child(findKey).delete();

          //刪除copy_task中photo陣列中的刪除項目
          vm.task.photo.splice(key, 1);
          vm.task.updateDate = new Date();

          let payload = {
            id: vm.id,
            data: vm.task,
          };
          console.log(payload);

          //=============存入資料庫======================
          vm.updateFieldRecord(payload);
        });
    },
    //設為頭像
    setAvatar(linkUrl) {
      let vm = this;
      vm.task.avatar = linkUrl;
      vm.task.updateDate = new Date();
      let payload = {
        id: vm.id,
        data: vm.task,
      };
      // console.log(payload);
      vm.updateFieldRecord(payload);
      this.$q.notify("設定頭像修改成功");
    },
    //=========修改儲存================
    onSubmit() {
      this.$refs.form.validate().then((success) => {
        if (this.task.name.trim() === "") {
          this.$q.dialog({
            title: "錯誤",
            message: "名字不能空白",
          });
          return false;
        }

        if (success) {
          //檢查欄位規則是正确的
          //存入資料庫
          let payload = {
            id: this.id,
            data: {
              ...this.task,
              updateDate: new Date(),
            },
          };
          console.log(payload);
          //資料庫更新
          this.updateFieldRecord(payload);

          this.$emit("listenToChild", false); //回傳關閉視窗;
        } else {
          console.log("檢查欄位規則錯誤");
        }
      });
    },
    onReset() {
      this.$emit("listenToChild", false); //回傳關閉視窗;
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
            console.log(vm.imageFiles);
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
          .child("/現場紀錄表/" + vm.id + "/" + item.filename)
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
              let findKey = "/現場紀錄表/" + vm.id + "/" + item.filename; //find 鍵值
              vm.imageFiles = []; //螢幕顯示部分，上傳完畢后，需清除
              let data = {
                linkURL: linkURL,
                findKey: findKey,
              };

              // vm.task.photo.push(data); 這樣會出錯
              //pure push copy
              vm.task.photo = [...vm.task.photo, data];

              (vm.task.avatar = vm.task.photo[0].linkURL), //第一張照片設為頭像
                // console.log(vm.task.avatar)
                (vm.task.updateDate = new Date());
              // 存入照片資料
              //   vm.task.photo[0].avatar = true; //第一張照片設為頭像
              console.log(vm.task);
              let payload = {
                id: vm.id,
                data: vm.task, //要更新所有欄位，否則在更新state時，因是全物件更新，所以會出錯
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

    // 測試OK，不過因沒有壓縮及傳送％，故暫不使用
    factoryFn(files) {
      let vm = this;

      const findKey = "/現場紀錄表/" + vm.id + "/" + files[0].name;
      console.log(files[0].name);
      const uploadTask = dbStorage.ref().child(findKey).put(files[0]);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          //非同步處理
          vm.uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        function (error) {
          console.log(error);
          alert("上傳圖片有錯誤！");
        },
        function () {
          //成功
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            let data = {
              linkURL: downloadURL,
              findKey: findKey,
            };
            console.log(data);
            // vm.task.photo.push(data); 這樣會出錯
            //pure push copy
            vm.task.photo = [...vm.task.photo, data];

            (vm.task.avatar = vm.task.photo[0].linkURL), //第一張照片設為頭像
              // console.log(vm.task.avatar)
              (vm.task.updateDate = new Date());
            // 存入照片資料
            //   vm.task.photo[0].avatar = true; //第一張照片設為頭像
            console.log(vm.task);
            let payload = {
              id: vm.id,
              data: vm.task, //要更新所有欄位，否則在更新state時，因是全物件更新，所以會出錯
            };

            //=============存入資料庫======================
            return vm.updateFieldRecord(payload);
          });
        }
      );
    },
  }, //methods
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


