<template>
  <div>
    <div class="preview-image-wrap">
      <img class="preview-image" ref="image" :src="imgInfo.linkURL" />

      <q-btn
        color="primary"
        label="裁切 "
        size="md"
        v-close-popup="2"
        @click="cropperFun"
        class="q-ma-md"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { dbFirestore, dbStorage } from "boot/firebase";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { extend } from "quasar";

export default {
  components: {},
  props: ["imgInfo", "id", "task", "photoIndex"],
  data() {
    return {
      my_cropper: null,
      cropperReady: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.image;
    // 第一次初始化好以後，如果預覽裁切的圖片發生了變化，裁切器默認不會更新
    // 如果需要預覽圖片發生變化更新裁切器
    // 方式一：裁切器 .replace 方法
    // 方式二：銷毀裁切器，重新初始化

    // 初始化裁切器
    this.my_cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      // background: false,
      movable: true
      // aspectRatio: 16 / 9,
      // crop(event) {
      //   console.log(event.detail.x);
      //   console.log(event.detail.y);
      //   console.log(event.detail.width);
      //   console.log(event.detail.height);
      //   console.log(event.detail.rotate);
      //   console.log(event.detail.scaleX);
      //   console.log(event.detail.scaleY);
      // }
    });
  },
  methods: {
    ...mapActions("LoadData", ["updateFieldRecord"]), //上傳圖片要特處理
    cropperFun() {
      // 1.獲取裁切的圖片物件
      this.my_cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob);
        //上傳檔案
        this.uploadImage(blob);
      });
    },
    //=============上傳圖片、照片檔案======================
    uploadImage(blob) {
      let vm = this;
      let uploadTask = dbStorage
        .ref()
        .child(vm.imgInfo.findKey) //照片儲存路徑不變
        .put(blob);
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          //非同步處理
        },
        function(error) {
          console.log(error);
          alert("上傳圖片有錯誤！");
        },
        function() {
          //成功
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            // 拷貝一份，更新用
            let copyData = extend(true, {}, vm.task);
            //裁切後的照片資訊
            let img = {
              linkURL: downloadURL,
              findKey: vm.imgInfo.findKey
            };
            copyData.photo[vm.photoIndex] = img;
            copyData.updateDate = new Date();
            // copyData.avatar = downloadURL; //設為頭像
            // 存入照片資料
            let payload = {
              id: vm.id,
              data: copyData //要更新所有欄位，否則在更新state時，因是全物件更新，所以會出錯
            };

            //=============存入資料庫======================
            vm.updateFieldRecord(payload);
            // v-close-popup=(2) 關閉兩層視窗;

            return;
          });
        }
      );
    }
  }
  // destroyed(){
  //   this.my_cropper.crop();
  //     this.my_cropper.destory()
  // }
};
</script>
<style scoped>
.preview-image {
  display: block;
  max-width: 100%;
  max-height: 500px;
}
</style>
