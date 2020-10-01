import Vue from 'vue'
import { dbFirestore } from 'boot/firebase'


const state = {
    professionalTitle: {}

}

const mutations = {
    
    setProfessionalTitle(state, payload) {
        state.professionalTitle = [...payload]
    },

}

const actions = {
    
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