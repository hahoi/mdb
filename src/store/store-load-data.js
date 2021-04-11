import Vue from 'vue'
import { uid, Notify } from 'quasar'
import { dbFirestore } from 'boot/firebase'

const state = {
    mdb: false,
    tasksDownloaded: false,


    FieldRecord: {},
    search: '',
    sort: 'updateDate', //'none',
    currentId: '',
    FieldRecordTotalCount: 0,


}

const mutations = {

    setMDB(state, value) {
        state.mdb = value
    },
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
    setFilter(state, value) {
        state.filter = value
    },
    setFieldRecordTotalCount(state, value) {
        state.FieldRecordTotalCount = value
    },
    //Object
    updateFieldRecord(state, payload) {
        Vue.set(state.FieldRecord, payload.id, payload.data)
        // console.log("state.FieldRecord",state.FieldRecord[payload.id])
    },
    deleteFieldRecord(state, id) {
        Vue.delete(state.FieldRecord, id)
    },
    addFieldRecord(state, payload) {
        Vue.set(state.FieldRecord, payload.id, payload.data)
        // console.log("addFieldRecord",state.FieldRecord[payload.id])
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
    // 紀錄
    log({ dispatch, commit, state, rootState }, payload) {
        // console.log(rootState.auth.userData.name)
        if (!payload) return
        let data = {
            date: new Date(), //記錄時間
            name: rootState.auth.userData.name,  //記錄使用者
            do: payload.do || "", //紀錄操作功能
            data: payload.data || "" //記錄資料
        }
        dbFirestore.collection("log").add(data);
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
                // 更新 state.FieldRecord，更新畫面
                commit("addFieldRecord", payload);
                console.log("資料庫新增成功！", ref.id);
                dispatch('log', { do: `新增${ payload.data.name}資料`, data: payload.data })
            })
            .catch(error => {
                console.error("資料庫儲存失敗！", error);
            });
    },

    //更新
    updateFieldRecord({ commit , dispatch }, payload) {
        // console.log(payload)
        dbFirestore
            .collection("現場紀錄表")
            .doc(payload.id)
            .update(payload.data)
            .then(() => {
                // 更新 state.FieldRecord，更新畫面
                commit("updateFieldRecord", payload);
                console.log("資料庫修改成功！");
                dispatch('log', { do: `修改${ payload.data.name}資料`, data: payload.data })
            })
            .catch(error => {
                console.error("資料庫更新失敗！", error);
            });

    },
    //刪除
    deleteFieldRecord({ commit, dispatch  }, payload) {
        dbFirestore
            .collection("現場紀錄表")
            .doc(payload.id)
            .delete()
            .then(() => {
                commit("deleteFieldRecord", payload.id);
                console.log("資料刪除成功！");
                dispatch('log', { do: `刪除${ payload.name}資料`, payload })
            })

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
            //更新日期排序，最近的（大）排在前面
            if (sA > sB) return -1
            else if (sA < sB) return 1
            else return 0

            // return sA.localeCompare(sB, "zh-hant"); //適合中文的排序
        })

        keysOrdered.forEach((key) => {
            FieldReordSorted[key] = state.FieldRecord[key]
        })

        return FieldReordSorted
    },
    FieldReordFiltered: (state, getters, rootState) => {
        let FieldReordSorted = getters.FieldReordSorted
        let FieldReordFiltered = {}
        let searchWord = state.search.trim();
        //過濾條件用空白分割成字串，用正則可一個或多個空白去分割
        let arraySearchWord = searchWord.split(/\s+/);

        // console.log(rootState.auth.userData.name)
        if (state.search) {
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