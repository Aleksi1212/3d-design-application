import DocEditor from "../../../../src/components/editor"


async function Editor({ params }: any) {
    const docCredentials = params.docId.split('%3D')

    let docs: any = {
        user: params.userId,
        docId: docCredentials[0],
        docName: docCredentials[1]
    }

    // docData.map((data) => {
    //     data.documents.forEach((doc) => {
    //         if (doc.docId === docCredentials[0] && doc.docName === docCredentials[1]) {
    //             docs.push(doc)                
    //         }
    //     })
    // })

    // const que = query(collectionGroup(db, 'designs'), where('user', '==', params.userId))

    // const getUserDocs = onSnapshot(que, (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         if (doc.data().designData.docId === docCredentials[0] && doc.data().designData.docName === docCredentials[1]) {
    //             docs.push(doc.data().designData)
    //         }
    //     })
    // })

    // console.log(docs);
    

    return (
        <DocEditor designData={docs} />
    )
}

export default Editor