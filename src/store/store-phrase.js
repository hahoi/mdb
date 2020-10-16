import Vue from 'vue'
import { dbFirestore } from 'boot/firebase'
import TwCity from 'src/utils/tw-city'


const state = {
    Cassify:[],
    professionalTitle: [],
    counties : TwCity.counties,  //縣市
    districts: TwCity.districts, //範圍：鄉鎮區里
}

const mutations = {
    setCassify(state, payload) {
        state.Cassify =[...payload]
    },
    
    setProfessionalTitle(state, payload) {
        state.professionalTitle = [...payload]
    },

}

const actions = {
        //更新
        UpdateCassify({ commit }, payload) {
            // console.log(payload)
            let data= {
                "分類": payload
            }
            dbFirestore
                .collection("SettingData")
                .doc("分類")
                .update(data)
                .then(() => {
                    // 更新 state.Cassify，更新畫面
                    commit("setCassify", payload);
                    console.log("資料庫修改成功！");
                })
                .catch(error => {
                    console.error("資料庫更新失敗！", error);
                });
    
        },

    ReadCassify({  commit }) {

        dbFirestore
            .collection("SettingData")
            .doc("分類")
            .get()
            .then(doc => {
                // console.log(doc.data().分類)
                commit('setCassify', doc.data().分類)
            }).catch(err => {
               console.log(err.message)
            });

    },
    
    readProfessionalTitle({ commit }) {

        //讀取一次，確定已經全部讀入，再做後續處理
        dbFirestore
            .collection("SettingData")
            .doc("職業職稱")
            .get()
            .then(doc=> {
                if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    // let Arr_pt = doc.data()['職業職稱片語']
                    commit('setProfessionalTitle',doc.data()['職業職稱片語'])
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            


    }







}

const getters = {
    
    


}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}