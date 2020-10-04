import Vue from 'vue'
import { uid, Notify } from 'quasar'
import { firebaseDb, firebaseAuth, dbFirestore } from 'boot/firebase'

const state = {
    tasksDownloaded: false,

    // FieldRecord: {
    //     'ID1': {
    //         name: '張三',
    //         mobilePhone: "097011111",
    //         companyPhone: "087320415",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "屏東市自由路527號",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "2020/9/16 屏東縣政府",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "素食",
    //         interest: "籃球",
    //         topic: "政治",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID2': {
    //         name: '李四',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "葷食",
    //         interest: "桌球",
    //         topic: "子女",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID3': {
    //         name: '王五',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "葷",
    //         interest: "看書、聽音樂",
    //         topic: "政治",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID4': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "政治",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID5': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "政治",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID6': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "葷食",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID7': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID8': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID9': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID10': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "葷食",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID11': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "葷食",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID12': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID13': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID14': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID15': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "政治",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID16': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID17': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID18': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID19': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID20': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID21': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID22': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID23': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID24': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID25': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID26': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID27': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID28': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID29': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "政治",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID30': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    //     'ID31': {
    //         name: '姓名一',
    //         mobilePhone: "手機一",
    //         companyPhone: "公司一",
    //         photo: "https://cdn.quasar.dev/img/boy-avatar.png",
    //         address: "地址一",
    //         professionalTitle: "職業職稱一",
    //         clubTitle: "社團職稱一",
    //         personalConnections: "人脈關係一",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項一",
    //         petitionMatters: "陳情事項一",
    //         diet: "飲食一",
    //         interest: "興趣一",
    //         topic: "話題一",
    //         other: "其他一",
    //         update: "5分鐘",
    //         star: 2,
    //     },
    //     'ID32': {
    //         name: '姓名二',
    //         mobilePhone: "手機二",
    //         companyPhone: "公司二",
    //         photo: "https://cdn.quasar.dev/img/avatar2.jpg",
    //         address: "地址二",
    //         professionalTitle: "職業職稱二",
    //         clubTitle: "社團職稱二",
    //         personalConnections: "人脈關係二",
    //         meetNotes: "初次見面日期",
    //         suggestions: "建言事項二",
    //         petitionMatters: "陳情事項二",
    //         diet: "飲食二",
    //         interest: "興趣二",
    //         topic: "話題二",
    //         other: "其他二",
    //         update: "1天前",
    //         star: 1,
    //     },
    //     'ID33': {
    //         name: '姓名三',
    //         mobilePhone: "手機三",
    //         companyPhone: "公司三",
    //         photo: "https://cdn.quasar.dev/img/avatar4.jpg",
    //         address: "地址三",
    //         professionalTitle: "職業職稱三",
    //         clubTitle: "社團職稱三",
    //         personalConnections: "人脈關係三",
    //         meetNotes: "初次見面日期",            
    //         suggestions: "建言事項三",
    //         petitionMatters: "陳情事項三",
    //         diet: "飲食三",
    //         interest: "興趣三",
    //         topic: "話題三",
    //         other: "其他三",
    //         update: "1月前",
    //         star: 3,
    //     },
    // },

    FieldRecord: {},
    search: '',
    sort: 'name',
    currentId: '',
    filter: {
        county: "屏東縣",
        district: "屏東市",
        name: ""
    },
    county:"",
    district: "",
    name: ""

}

const mutations = {
    clearFieldReord(state) {
        state.FieldRecord = {}
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
    setCounty(state, value) {
        state.county = value
    },
    setDistrict(state, value) {
        state.district = value
    },
    setName(state, value) {
        state.name = value
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
    },//增加一筆
    addFieldRecord({ commit, dispatch }, data) { //建議跟mutations同名，較好記
        dbFirestore
            .collection("現場紀錄表")
            .add(data)
            .then((ref) => {
                //紀錄新增資料的ID工上傳照片用
                commit('setCurrentId', ref.id)
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
                console.log("資料刪除成功！");
            })

    },



    //讀取資料
    fbReadData({ state, commit }) {
        // let userId = firebaseAuth.currentUser.uid
        // console.log("userId", userId)
        
        commit('clearFieldReord')
        //從名字查找
        if (state.name) {
            //監聽資料
            dbFirestore
                .collection("現場紀錄表")
                .where("name", "==", state.name)
                // .limit(100)
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach((change) => {

                        if (change.type === "added") {
                            let payload = {
                                id: change.doc.id,
                                data: change.doc.data()
                            }
                            commit('addFieldRecord', payload)
                        }
                        if (change.type === "modified") {
                            let payload = {
                                id: change.doc.id,
                                data: change.doc.data()
                            }
                            commit('updateFieldRecord', payload)

                        }
                        if (change.type === "removed") {
                            let payload = {
                                id: change.doc.id,
                            }
                            commit('deleteFieldRecord', payload)
                        }
                    });
                });

            //讀取一次，確定已經全部讀入，再做後續處理
            dbFirestore
                .collection("現場紀錄表")
                .where("name", "==", state.name)
                .get()
                .then(qs => {
                    // qs.forEach(doc => {
                    //     console.log(doc)
                    // })
                    commit('setTasksDownloaded', true)
                }).catch(err => {
                    // showErrorMessage(err.message)
                    this.$q.dialog({
                        title: "錯誤",
                        message: err.message,
                    });
                });


        }else if (state.district) {//縣市範圍
            console.log(state.county,state.district)

            //監聽資料
            dbFirestore
                .collection("現場紀錄表")
                .where("county", "==", state.county)
                .where("district", "==", state.district)//縣市範圍
                // .limit(100)
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach((change) => {

                        if (change.type === "added") {
                            let payload = {
                                id: change.doc.id,
                                data: change.doc.data()
                            }
                            commit('addFieldRecord', payload)
                        }
                        if (change.type === "modified") {
                            let payload = {
                                id: change.doc.id,
                                data: change.doc.data()
                            }
                            commit('updateFieldRecord', payload)

                        }
                        if (change.type === "removed") {
                            let payload = {
                                id: change.doc.id,
                            }
                            commit('deleteFieldRecord', payload)
                        }
                    });
                });

            //讀取一次
            dbFirestore
                .collection("現場紀錄表")
                .where("county", "==", state.county)
                .where("district", "==", state.district)//縣市範圍
                .get()
                .then(qs => {
                    // qs.forEach(doc => {
                    //     console.log(doc)
                    // })
                    commit('setTasksDownloaded', true)
                }).catch(err => {
                    // showErrorMessage(err.message)
                    this.$q.dialog({
                        title: "錯誤",
                        message: err.message,
                    });
                });


            // return
        }else if (state.county) {//縣市
            console.log(state.county)
            //監聽資料
            dbFirestore
                .collection("現場紀錄表")
                .where("county", "==", state.county) //縣市
                // .limit(100)
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach((change) => {

                        if (change.type === "added") {
                            let payload = {
                                id: change.doc.id,
                                data: change.doc.data()
                            }
                            commit('addFieldRecord', payload)
                        }
                        if (change.type === "modified") {
                            let payload = {
                                id: change.doc.id,
                                data: change.doc.data()
                            }
                            commit('updateFieldRecord', payload)

                        }
                        if (change.type === "removed") {
                            let payload = {
                                id: change.doc.id,
                            }
                            commit('deleteFieldRecord', payload)
                        }
                    });
                });

            //讀取一次
            dbFirestore
                .collection("現場紀錄表")
                .where("county", "==", state.county) //縣市
                .get()
                .then(qs => {
                    // qs.forEach(doc => {
                    //     console.log(doc)
                    // })
                    commit('setTasksDownloaded', true)
                }).catch(err => {
                    // showErrorMessage(err.message)
                    this.$q.dialog({
                        title: "錯誤",
                        message: err.message,
                    });
                });


            // return true
        }


        // //監聽資料
        // dbFirestore
        //     .collection("現場紀錄表")
        //     .where("county", "==", state.county)
        //     // .limit(100)
        //     .onSnapshot(snapshot => {
        //         snapshot.docChanges().forEach((change) => {

        //             if (change.type === "added") {
        //                 let payload = {
        //                     id: change.doc.id,
        //                     data: change.doc.data()
        //                 }
        //                 commit('addFieldRecord', payload)
        //             }
        //             if (change.type === "modified") {
        //                 let payload = {
        //                     id: change.doc.id,
        //                     data: change.doc.data()
        //                 }
        //                 commit('updateFieldRecord', payload)

        //             }
        //             if (change.type === "removed") {
        //                 let payload = {
        //                     id: change.doc.id,
        //                 }
        //                 commit('deleteFieldRecord', payload)
        //             }
        //         });
        //     });

        // //讀取一次，確定已經全部讀入，再做後續處理
        // dbFirestore
        //     .collection("現場紀錄表")
        //     .get()
        //     .then(qs => {
        //         // qs.forEach(doc => {
        //         //     console.log(doc)
        //         // })
        //         commit('setTasksDownloaded', true)
        //     }).catch(err => {
        //         // showErrorMessage(err.message)
        //         this.$q.dialog({
        //             title: "錯誤",
        //             message: err.message,
        //         });
        //     });

        // if(state.county){
        //     console.log(state.county)
        //     dbFirestore
        //       .collection("現場紀錄表")
        //       .where("county", "==", state.county)
        //       .get()
        //       .then((qs) => {
        //         // qs.forEach((doc) => {
        //         //   console.log(doc.data());
        //         // });
        //         commit('setTasksDownloaded', true)
        //       })
        //       .catch((err) => {
        //         // showErrorMessage(err.message)
        //         this.$q.dialog({
        //           title: "錯誤",
        //           message: err.message,
        //         });
        //       });
        // }

    }








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
        let FieldReordSorted = getters.FieldReordSorted
        let FieldReordFiltered = {}
        let searchWord = state.search.trim();
        //過濾條件用空白分割成字串，用正則可一個或多個空白去分割
        let arraySearchWord = searchWord.split(/\s+/);

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