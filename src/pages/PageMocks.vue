<template>
  <div>
    <q-btn @click="dowork">模擬資料</q-btn>
    <q-btn @click="saveToFirestore">寫入資料庫</q-btn>
    <!-- <pre> {{ mockData }}</pre> -->

  </div>
</template>

<script>
import {  dbFirestore } from 'boot/firebase'
export default {
  name: "",
  data() {
    return {
      mockData: "",
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    saveToFirestore(){
      this.mockData.forEach(data=>{
        console.log(data);
        dbFirestore
            .collection("現場紀錄表")
            .add(data)
            .then((ref) => {
                console.log("資料庫新增成功！", ref.id);
            })
            .catch(error => {
                console.error("資料庫儲存失敗！", error);
            });
      })

    },
    dowork() {
      const convert = require("chinese_convert");

      const Mock = require("mockjs");
      const Random = Mock.Random;
      let posts = [];
      
      for (let i = 0; i < 1000; i++) {
        let county = Mock.mock({
        "array|1": [
          '台北市', '基隆市', '新北市', '宜蘭縣', '桃園市', '新竹市', '新竹縣', '苗栗縣',
        '台中市', '彰化縣', '南投縣', '嘉義市', '嘉義縣', '雲林縣', '台南市', '高雄市',
        '屏東縣', '台東縣', '花蓮縣','澎湖縣', '金門縣', '連江縣'
        ],
      });
      county.array = convert.cn2tw(county.array)
      let district = {array:""}
      if(county.array == '台北市') {
         district = Mock.mock({
          "array|1": [
              '中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區',
              '士林區', '北投區', '內湖區', '南港區', '文山區'
          ],
        });
      }
      if(county.array == '基隆市') {
         district = Mock.mock({
          "array|1": [
            '仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'
          ],
        });
      }
      if(county.array == '新北市') {
         district = Mock.mock({
          "array|1": [
            '萬里區', '金山區', '板橋區', '汐止區', '深坑區', '石碇區', '瑞芳區', '平溪區',
            '雙溪區', '貢寮區', '新店區', '坪林區', '烏來區', '永和區', '中和區', '土城區',
            '三峽區', '樹林區', '鶯歌區', '三重區', '新莊區', '泰山區', '林口區', '蘆洲區',
            '五股區', '八里區', '淡水區', '三芝區', '石門區'
          ],
        });
      }
      if(county.array == '宜蘭縣') {
         district = Mock.mock({
          "array|1": [
            '宜蘭市', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '羅東鎮', '三星鄉', '大同鄉',
            '五結鄉', '冬山鄉', '蘇澳鎮', '南澳鄉', '釣魚台列嶼'
          ],
        });
      }
      if(county.array == '桃園市') {
         district = Mock.mock({
          "array|1": [
    		'中壢區', '平鎮區', '龍潭區', '楊梅區', '新屋區', '觀音區', '桃園區', '龜山區',
    		'八德區', '大溪區', '復興區', '大園區', '蘆竹區'
          ],
        });
      }
      if(county.array == '新竹市') {
         district = Mock.mock({
          "array|1": [
            '東區', '北區', '香山區'
          ],
        });
      }
      if(county.array == '新竹縣') {
         district = Mock.mock({
          "array|1": [
            '竹北市', '湖口鄉', '新豐鄉', '新埔鎮', '關西鎮', '芎林鄉', '寶山鄉',
            '竹東鎮', '五峰鄉', '橫山鄉', '尖石鄉', '北埔鄉', '峨眉鄉'
          ],
        });
      }
      if(county.array == '苗栗縣') {
         district = Mock.mock({
          "array|1": [
            '竹南鎮', '頭份市', '三灣鄉', '南庄鄉', '獅潭鄉', '後龍鎮', '通霄鎮', '苑裡鎮',
            '苗栗市', '造橋鄉', '頭屋鄉', '公館鄉', '大湖鄉', '泰安鄉',
            '銅鑼鄉', '三義鄉', '西湖鄉', '卓蘭鎮'
          ],
        });
      }
      if(county.array == '台中市') {
         district = Mock.mock({
          "array|1": [
            '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區',
            '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '石岡區', '東勢區', '和平區',
            '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區',
            '清水區', '大甲區', '外埔區', '大安區'
          ],
        });
      }
      if(county.array == '彰化縣') {
         district = Mock.mock({
          "array|1": [
            '彰化市', '芬園鄉', '花壇鄉', '秀水鄉', '鹿港鎮', '福興鄉', '線西鄉', '和美鎮',
            '伸港鄉', '員林市', '社頭鄉', '永靖鄉', '埔心鄉', '溪湖鎮', '大村鄉', '埔鹽鄉',
            '田中鎮', '北斗鎮', '田尾鄉', '埤頭鄉', '溪州鄉', '竹塘鄉', '二林鎮', '大城鄉',
            '芳苑鄉', '二水鄉'
          ],
        });
      }
      if(county.array == '南投縣') {
         district = Mock.mock({
          "array|1": [
            '南投市', '中寮鄉', '草屯鎮', '國姓鄉', '埔里鎮', '仁愛鄉', '名間鄉', '集集鎮',
            '水里鄉', '魚池鄉', '信義鄉', '竹山鎮', '鹿谷鄉'
          ],
        });
      }
      if(county.array == '嘉義市') {
         district = Mock.mock({
          "array|1": [
            '東區', '西區'
          ],
        });
      }
      if(county.array == '嘉義縣') {
         district = Mock.mock({
          "array|1": [
            '番路鄉', '梅山鄉', '竹崎鄉', '阿里山', '中埔鄉', '大埔鄉', '水上鄉',
            '鹿草鄉', '太保市', '朴子市', '東石鄉', '六腳鄉', '新港鄉', '民雄鄉', '大林鎮',
            '溪口鄉', '義竹鄉', '布袋鎮'
          ],
        });
      }
      if(county.array == '雲林縣') {
         district = Mock.mock({
          "array|1": [
            '斗南鎮', '大埤鄉', '虎尾鎮', '土庫鎮', '褒忠鄉', '東勢鄉', '台西鄉', '崙背鄉',
            '麥寮鄉', '斗六市', '林內鄉', '古坑鄉', '莿桐鄉', '西螺鎮', '二崙鄉', '北港鎮',
            '水林鄉', '口湖鄉', '四湖鄉', '元長鄉'
          ],
        });
      }
      if(county.array == '台南市') {
         district = Mock.mock({
          "array|1": [
            '中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區',
            '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區',
            '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區',
            '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區',
            '大內區', '山上區', '新市區', '安定區'
          ],
        });
      }
      if(county.array == '高雄市') {
         district = Mock.mock({
          "array|1": [
            '新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區',
            '楠梓區', '小港區', '左營區', '仁武區', '大社區', '東沙群島', '南沙群島', '岡山區',
            '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區',
            '湖內區', '鳳山區', '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區',
            '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區', '茂林區', '茄萣區'
          ],
        });
      }
      if(county.array == '屏東縣') {
         district = Mock.mock({
          "array|1": [
            '屏東市', '三地門鄉', '霧台鄉', '瑪家鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埔鄉',
            '長治鄉', '麟洛鄉', '竹田鄉', '內埔鄉', '萬丹鄉', '潮州鎮', '泰武鄉', '來義鄉',
            '萬巒鄉', '崁頂鄉', '新埤鄉', '南州鄉', '林邊鄉', '東港鎮', '琉球鄉', '佳冬鄉',
            '新園鄉', '枋寮鄉', '枋山鄉', '春日鄉', '獅子鄉', '車城鄉', '牡丹鄉', '恆春鎮',
            '滿州鄉'
          ],
        });
      }
      if(county.array == '台東縣') {
         district = Mock.mock({
          "array|1": [
            '台東市', '綠島鄉', '蘭嶼鄉', '延平鄉', '卑南鄉', '鹿野鄉', '關山鎮', '海端鄉',
            '池上鄉', '東河鄉', '成功鎮', '長濱鄉', '太麻里', '金峰鄉', '大武鄉', '達仁鄉'
          ],
        });
      }
      if(county.array == '花蓮縣') {
         district = Mock.mock({
          "array|1": [
            '花蓮市', '新城鄉', '秀林鄉', '吉安鄉', '壽豐鄉', '鳳林鎮', '光復鄉', '豐濱鄉',
            '瑞穗鄉', '萬榮鄉', '玉里鎮', '卓溪鄉', '富里鄉'
          ],
        });
      }
      if(county.array == '澎湖縣') {
         district = Mock.mock({
          "array|1": [
            '馬公市', '西嶼鄉', '望安鄉', '七美鄉', '白沙鄉', '湖西鄉'
          ],
        });
      }
      if(county.array == '金門縣') {
         district = Mock.mock({
          "array|1": [
            '金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉', '烏坵鄉'
          ],
        });
      }
      if(county.array == '連江縣') {
         district = Mock.mock({
          "array|1": [
            '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'
          ],
        });
      }

      district.array = convert.cn2tw(district.array)


        let avatar = Mock.mock({
        "array|1": [
          "https://cdn.quasar.dev/img/boy-avatar.png",
          "https://cdn.quasar.dev/img/avatar1.jpg",
          "https://cdn.quasar.dev/img/avatar2.jpg",
          "https://cdn.quasar.dev/img/avatar3.jpg",
          "https://cdn.quasar.dev/img/avatar4.jpg",
          "https://cdn.quasar.dev/img/avatar5.jpg",
          "https://cdn.quasar.dev/img/avatar6.jpg",
        ],
      });
      
       let photo = Mock.mock({
        "array|1": [
          "https://placeimg.com/500/300/nature","https://cdn.quasar.dev/img/image-2x.png","https://cdn.quasar.dev/img/mountains.jpg", "https://cdn.quasar.dev/img/chicken-salad.jpg"
        ],
      });
      let photoArray = []
      let linkURL = {
        linkURL:photo.array
      }
      photoArray.push(linkURL)


      let interest = Mock.mock({
        "array|1": ["運動","籃球","羽毛球","兵乓球","足球","跑步","跳繩","舉重","聽音樂","看電影","繪畫","寫小說","看書","麻將","拼圖","桌面遊戲","網游","品茶","彈吉他","鋼琴","薩克斯",
      ],
      });



      let diet1 =Mock.mock({
              "array|1": ["葷食","素食"],
            });

      let diet2 =Mock.mock({
              "array|1": ["牛肉","點心","蔬菜","羊肉","豬肉","少鹽"],
            });









      let post = {
          name: convert.cn2tw(Random.cname()),
          mobilePhone: Random.cword("0123456789", 9, 9),
          companyPhone: Random.cword("0123456789", 7, 7),
          avatar: avatar.array,
          photo:photoArray,
          county: county.array,
          district: district.array,
          address: county.array + district.array+Random.cword(2, 2) +"路" + Random.cword("0123456789", 1, 3)+ "號",
          professionalTitle: convert.cn2tw(Random.ctitle()),
          clubTitle: convert.cn2tw(Random.ctitle()),
          personalConnections: convert.cn2tw(Random.ctitle()),
          meetNotes: convert.cn2tw(Random.csentence(10.25)),
          suggestions: convert.cn2tw(Random.csentence(10.25)),
          petitionMatters: convert.cn2tw(Random.csentence(10.25)),
          diet: diet1.array + "、" + diet2.array,
          interest: interest.array,
          topic: convert.cn2tw(Random.ctitle()),
          other: convert.cn2tw(Random.ctitle()),
          update: Random.now(),
          star: Random.integer(0, 5),
        };
        posts.push(post);
      }
      this.mockData = posts;

      //   var data = Mock.mock({
      //     "list|2": [
      //       {
      //         "id|+1": 1,
      //         color: "@color()",
      //         date: "@datetime()",
      //         img: "@image()",
      //         url: "@url(http)",
      //         email: "@email()",
      //         name: "@name(1,2)",
      //         text: "@paragraph()",
      //       },
      //     ],
      //   });
      //   this.mockData = JSON.stringify(data)
      //   console.log(data);

      //   let cn = "简繁转换功能测试";
      //   let tw = convert.cn2tw(cn);
      //   let cn2 = convert.tw2cn(tw);

      //   console.log("cn=%s => tw=%s", cn, tw);
      //   console.log("tw=%s => cn2=%s", tw, cn2);
    },
  },
};
</script>

<style>
</style>
