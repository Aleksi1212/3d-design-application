import DocEditor from "../../../../src/components/editor"

import { getUserData } from "../../../../src/datalayer/querys"

import { db } from "../../../../src/datalayer/config"
import { collection, where, query, doc, getDocs, updateDoc, onSnapshot, collectionGroup } from "firebase/firestore"

async function Editor({ params }: any) {
    const docCredentials = params.docId.split('%3D')
    const docData = await getUserData({ userId: params.userId })

    let docs: any = [params.userId]

    docData.map((data) => {
        // data.documents.forEach((doc) => {
        //     if (doc.docId === docCredentials[0] && doc.docName === docCredentials[1]) {
        //         docs.push(doc)                
        //     }
        // })

        for (let i = 0; i < data.documents.length; i++) {
            if (data.documents[i].docId === docCredentials[0] && data.documents[i].docName === docCredentials[1]) {
                docs.push(data.documents[i], i)
            }
        }
    })

    const que = query(collectionGroup(db, 'designs'), where('user', '==', params.userId))

    const getUserDocs = onSnapshot(que, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
        })
    })

    // const test = await getDocs(que)
    // const snap = test.docs.map((doc) => doc.data())
    // snap.map((data) => {
    //     console.log(data);
    // })
    

    return (
        <DocEditor designData={docs} />
    )
}

export default Editor