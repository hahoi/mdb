<template>
  <div class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video v-show="!imageCaptured" ref="video" class="full-width" autoplay />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="hasCameraSupport"
        @click="captureImage"
        :disable="imageCaptured"
        color="grey-10"
        icon="eva-camera"
        size="lg"
        round
      />
      <q-file
        v-else
        v-model="imageUpload"
        @input="captureImageFallback"
        label="選擇圖片檔"
        accept="image/*"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>

      <div class="row justify-center q-mt-lg">
        <q-btn
          @click="uploadImage()"
          :disable="!post.photo"
          color="primary"
          label="上傳照片"
          rounded
          unelevated
        />
      </div>
      <div v-if="uploadProgress > 0">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { dbFirestore, dbStorage } from "boot/firebase";
import com_fun from "src/utils/function";
import { extend, uid } from "quasar";

export default {
  name: "MyCamera",
  props: ["task", "id"],
  data() {
    return {
      post: {
        photo: null
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,

      uploadProgress: 0
    };
  },
  computed: {},
  methods: {
    ...mapActions("LoadData", ["updateFieldRecord"]),
    initCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          this.$refs.video.srcObject = stream;
        })
        .catch(error => {
          this.hasCameraSupport = false;
        });
    },
    captureImage() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },
    captureImageFallback(file) {
      this.post.photo = file;

      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");

      var reader = new FileReader();
      reader.onload = event => {
        var img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        track.stop();
      });
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    },

    //上傳圖片
    uploadImage() {
      let vm = this;
      this.$q.loading.show();
      console.log(this.id);
      console.log(this.post.photo.name);
      vm.uploadProgress = 0; //上傳圖形進度

      let filename =
        typeof this.post.photo.name === "undefined"
          ? uid() + ".jpg"
          : uid() + this.post.photo.name;
      //iPhone會產生image.jpg檔名，改唯一編碼
      console.log(filename);

      let uploadTask = dbStorage
        .ref()
        .child("/現場紀錄表/" + this.id + "/" + filename)
        .put(this.post.photo);

      uploadTask.on(
        "state_changed",
        function(snapshot) {
          //非同步處理上傳過程顯示
          vm.uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        function(error) {
          console.log(error);
          this.$q.dialog({
            title: "Error",
            message: "上傳圖片發生錯誤!"
          });
        },
        function() {
          //成功
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log(downloadURL);

            let linkURL = downloadURL; //link URL
            let findKey = "/現場紀錄表/" + vm.id + "/" + filename; //find 鍵值
            let imageLink = {
              linkURL: linkURL,
              findKey: findKey
            };

            // 因要取得資料庫id資料先新增存檔，vm.data已存入vuex，故要拷貝另一份作處理
            let copyData = extend(true, {}, vm.task);
            copyData.photo.push(imageLink);
            copyData.avatar = linkURL; //設為頭像
            copyData.updateDate = new Date();
            console.log(copyData);
            let payload = {
              id: vm.id,
              data: copyData //要更新所有欄位，否則在更新state時，因是全物件更新，所以會出錯
            };
            //=============存入資料庫======================
            vm.updateFieldRecord(payload);
            // vm.imageUpload = []; //螢幕顯示部分，上傳完畢后，需清除
            vm.$emit("listenCamera", false); //回傳關閉視窗;

            return;
          });
        }
      );

      this.$q.loading.hide();
      return;
    }
  },
  mounted() {
    this.initCamera();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  }
};
</script>

<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
