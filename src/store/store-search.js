import Vue from 'vue'
import { dbFirestore } from 'boot/firebase'

const state = {
    tasksDownloaded: false,

    FieldRecord: {},
    search: '',
    sort: 'none',
    currentId: '',
    star: 0,


}

const mutations = {
    clearFieldReord(state) {
        state.FieldRecord = {}
    },
    setFieldReord(state, value) {
        state.FieldRecord = Object.assign({}, value)
    },
    setSearch(state, value) {
        state.search = value
    },
    setSort(state, value) {
        state.sort = value
    },
    setTasksDownloaded(state, value) {
        state.tasksDownloaded = value
    },
    setCurrentId(state, value) {
        state.currentId = value
    },
    setStar(state, value) {
        state.star = value
    },
    setRedDot(state, value) {
        state.RedDot = value
    },
    //Object
    updateFieldRecord(state, payload) {
        Vue.set(state.FieldRecord, payload.id, payload.data)
    },
    deleteFieldRecord(state, payload) {
        Vue.delete(state.FieldRecord, payload.id)
    },
    addFieldRecord(state, payload) {
        // console.log(payload.id, payload.data)
        Vue.set(state.FieldRecord, payload.id, payload.data)
    },

}

const actions = {
    setFilter({ commit }, value) {
        commit('setFilter', value)
    },

    setSearch({ commit }, value) {
        commit('setSearch', value)
    },
    setSort({ commit }, value) {
        commit('setSort', value)
    },
    //增加一筆
    addFieldRecord({ commit, dispatch }, data) { //建議跟mutations同名，較好記
        dbFirestore
            .collection("現場紀錄表")
            .add(data)
            .then((ref) => {
                //紀錄新增資料的ID工上傳照片用
                commit('setCurrentId', ref.id)
                let payload = {
                    id: ref.id,
                    data: data,
                };
                commit("addFieldRecord", payload);
                console.log("資料庫新增成功！", ref.id);
            })
            .catch(error => {
                console.error("資料庫儲存失敗！", error);
            });
    },
    updateFieldRecord({ }, payload) {
        console.log("get", payload)
        dbFirestore
            .collection("現場紀錄表")
            .doc(payload.id)
            .update(payload.data)
            .then(() => {
                commit("updateFieldRecord", payload);
                console.log("資料庫修改成功！");
            })
            .catch(error => {
                console.error("資料庫儲存失敗！", error);
            });

    },

    deleteFieldRecord({ }, id) {
        dbFirestore
            .collection("現場紀錄表")
            .doc(id)
            .delete()
            .then(() => {
                commit("deleteFieldRecord", payload);
                console.log("資料刪除成功！");
            })

    },



    // //監聽資料
    monitor({ getters, commit }) {

        // dbFirestore
        //     .collection("現場紀錄表")
        //     // .doc(key)
        //     .limit(1)
        //     .onSnapshot((snapshot) => {
        //         snapshot.docChanges().forEach((change) => {
        //             if (change.type === "added") {
        //                 let payload = {
        //                     id: change.doc.id,
        //                     data: change.doc.data(),
        //                 };
        //                 commit("addFieldRecord", payload);
        //                 console.log("add", payload.id, payload.data.name);
        //             }
        //             if (change.type === "modified") {
        //                 let payload = {
        //                     id: change.doc.id,
        //                     data: change.doc.data(),
        //                 };
        //                 commit("updateFieldRecord", payload);
        //                 console.log("modified", payload.id, payload.data.name);
        //             }
        //             if (change.type === "removed") {
        //                 let payload = {
        //                     id: change.doc.id,
        //                 };
        //                 commit("deleteFieldRecord", payload);
        //                 console.log("removed", payload.id, payload.data.name);
        //             }
        //         });
        //     });


        // Object.keys(getters.FieldReordFiltered).forEach((key) => {
        //     dbFirestore
        //         .collection("現場紀錄表")
        //         .doc(key)
        //         .onSnapshot((snapshot) => {
        //             console.log(snapshot)
        //         })
        //         .catch((err) => {
        //             console.log(err.message);
        //         });
        // });
    },




}

const getters = {
    FindRecordLength: (state, getters) => {
        return Object.keys(getters.FieldReordFiltered).length
    },
    FieldReordSorted: (state) => {
        if (state.sort === 'none') {
            return state.FieldRecord
        }
        let FieldReordSorted = {},
            keysOrdered = Object.keys(state.FieldRecord)

        keysOrdered.sort((a, b) => {
            let sA = state.FieldRecord[a][state.sort]
            let sB = state.FieldRecord[b][state.sort]
            // if (sA > sB) return 1
            // else if (sA < sB) return -1
            // else return 0
            return sA.localeCompare(sB, "zh-hant"); //適合中文的排序
        })

        keysOrdered.forEach((key) => {
            FieldReordSorted[key] = state.FieldRecord[key]
        })

        return FieldReordSorted
    },
    FieldReordFiltered: (state, getters) => {
        // if (!state.search) {
        //     return false
        // }
        let FieldReordSorted = getters.FieldReordSorted
        let FieldReordFiltered = {}
        
        if (state.search) {
            let searchWord = state.search.trim();
            //過濾條件用空白分割成字串，用正則可一個或多個空白去分割
            let arraySearchWord = searchWord.split(/\s+/);
            
            Object.keys(FieldReordSorted).forEach((id) => {
                let task = FieldReordSorted[id]

                let ok_flag = true; // and 都符合
                //用arr_flag保存每筆資料對每個關鍵字比對結果
                let arr_flag = [];
                let x = arraySearchWord.length; // flag陣列長度=要搜尋關鍵字的個數
                while (x--) {
                    arr_flag[x] = false; //先將判斷flag，全部設為 false
                }


                //每一筆資料比對多個關鍵字 and
                arraySearchWord.forEach((keyword, index) => {

                    // console.log(keyword)

                    //搜尋每個欄位
                    Object.keys(task).forEach((key) => {

                        //搜尋星星，and 要先符合                        
                        // if (task['star'] >= state.star) {
                            //搜尋文字型態個欄位
                            if (typeof task[key] === 'string') {
                                let item = task[key]
                                // console.log(key,task[key])
                                let searchLowerCase = keyword.toLowerCase()
                                if (item.includes(searchLowerCase)) {
                                    // FieldReordFiltered[id] = task
                                    arr_flag[index] = true; //先把符合的記下來                                    
                                }
                            }
                        // }

                    })
                })

                //判斷每一筆資料是否符合多個關鍵字
                //搜尋多條件，and 計算，其中一個是false就不符合
                arr_flag.forEach(function (a) {
                    if (a == false) {
                        ok_flag = false; //and
                    }
                });

                //全部搜尋關鍵字都符合
                if (ok_flag) {
                    FieldReordFiltered[id] = task
                }


            })
            return FieldReordFiltered
        }
        return FieldReordSorted
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}