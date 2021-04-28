const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
const adminApp = admin.initializeApp();

exports.AdminListUsers = functions.https.onCall((data, context) => {
    return adminApp.auth().listUsers().then(listUsersResult => {
        let users = []
        listUsersResult.users.forEach((userRecord) => {
            users.push(userRecord.toJSON())
        })
        return users
    }).catch(err => {
        return err;
    })
})

exports.AdminDeleteUsers = functions.https.onCall((data, context) => {
    const uid = data.uid;
    return adminApp.auth().deleteUser(uid)
        .then(function () {
            console.log('Successfully deleted user');
            return 'Successfully deleted user'
        })
        .catch(function (error) {
            console.log('Error deleting user:', error);
        });
})


exports.logActivities = functions.firestore.document('/{collection}/{id}')
    .onCreate((snap, context) => {

        const activities = admin.firestore().collection('activities');
        const collection = context.params.collection;

        if (collection === '現場紀錄表') {
            // console.log('現場紀錄表')
            // console.log(snap.data().name);
            // console.log(context.auth.email)

            //   return activities.add({ text: 'a new tutorial request was added' });
        }
        if (collection === 'MDBUsers') {
            // console.log('使用者資料')
            //   return activities.add({ text: 'a new user signed up'});
        }

        return null;

    });

// //計算現場紀錄表筆數（以下測試成功）
// const updateCount = async (delta) => {
//     await admin
//         .firestore()
//         .collection("現場紀錄表_counter")
//         .doc("counter")
//         .set({ count: admin.firestore.FieldValue.increment(delta) }, { merge: true });
// }


// exports.recordOnCreate = functions.firestore.document('/{collection}/{id}')
//     .onCreate((snap, context) => {
//         const collection = context.params.collection;
//         if (collection === '現場紀錄表') {
//             updateCount(+1)
//         }
//     })
// exports.recordOnDelete = functions.firestore.document('/{collection}/{id}')
//     .onDelete((snap, context) => {
//         const collection = context.params.collection;
//         if (collection === '現場紀錄表') {
//             updateCount(-1)
//         }
//     })

//計算現場紀錄表筆數（firebase deploy --only functions 這樣才會更新到實名函數）
/*
實名函數要在呼叫前定義
*/
const db = admin.firestore();

const cleanup = async () => {
    const limitDate = new Date(Date.now() - 1000 * 60 * 10);

    const batch = db.batch();

    const pastEvents = await db
        .collection("現場紀錄表_counter/counter/events")
        .orderBy("createdAt", "asc")
        .where("createdAt", "<", limitDate)
        .limit(400)
        .get();

    pastEvents.forEach(event => batch.delete(event.ref));

    await batch.commit();
}

/*
創建或刪除文檔後，我們將存儲一個由eventId索引的文檔，
如果create throw表示事件已被處理，否則它將創建該文檔，
從而阻止其他調用來處理該事件，
然後我們可以更新計數器。
最後，我們每隔約300次更新就對舊事件進行定期清理
（也可以在預定功能中完成）。
為了獲得計數，只需要讀取計數器即可。
*/

const updateCount = async (eventId, delta) => {
    try {
        // create will throw ALREADY_EXISTS if the event has already been processed
        // 如果事件已被处理，create将抛出ALREADY_EXISTS
        await db
            .doc(`現場紀錄表_counter/counter/events/${eventId}`)
            .create({ createdAt: admin.firestore.FieldValue.serverTimestamp() });

        await db
            .doc("現場紀錄表_counter/counter")
            .set({ count: admin.firestore.FieldValue.increment(delta) }, { merge: true });

        if (Math.random() < 1.0 / 300) {
            await cleanup();
        }
    } catch (error) {
        if (error.code === GrpcStatus.ALREADY_EXISTS) {
            functions.logger.debug("Duplicated event trigger!");
        } else {
            throw error;
        }
    }
}


exports.recordOnCreate = functions.firestore.document('/{collection}/{id}')
    .onCreate((snap, context) => {
        const collection = context.params.collection;
        if (collection === '現場紀錄表') {
            updateCount(context.eventId, +1)
        }
    })
exports.recordOnDelete = functions.firestore.document('/{collection}/{id}')
    .onDelete((snap, context) => {
        const collection = context.params.collection;
        if (collection === '現場紀錄表') {
            updateCount(context.eventId, -1)
        }
    })












// //備份全部資料指令    gcloud firestore export gs://pthgdb-backup
// //還原全部資料指令    gcloud firestore import gs://pthgdb-backup/2021-03-30T03:03:53_86661
// //注意：如果數據庫中的文檔不受導入影響，則導入後它將保留在數據庫中。





//資料庫備份，利用pub/sub 呼叫cloud function exportDB，再用scheduler 排程執行
// const { auth } = require('google-auth-library'); 

// const { google } = require('googleapis');

// async function exportDB () {
//     const auth = await google.auth.getClient({
//         scopes: ['https://www.googleapis.com/auth/datastore'],
//       });


// async function exportDB () {
//     const admin = await auth.getClient({
//         scopes: [   // scopes required to make a request
//             'https://www.googleapis.com/auth/datastore',
//             'https://www.googleapis.com/auth/cloud-platform'
//         ]
//     });
//     const projectId = await auth.getProjectId();
//     const url = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`;
//    //******* v1beta2 要特別注意版本的問題 ，目前用 vibeta1**********

//     return admin.request({
//         url,
//         method: 'post',
//         data: {
//             //這裡要更改為Storage 瀏覽器中值區 mdb_backup
//             outputUriPrefix: 'gs://mdb_backup'
//         }
//     });
// }

// //要在pub/sub 建立 主題 mdb_backup
// const backupDB = functions.pubsub.topic('mdb_backup').onPublish(exportDB);

// module.exports = { backupDB };
