import DocEditor from "../../../../src/components/editor"

import { db } from "../../../../src/datalayer/config"
import { query, where, collection, getDocs } from "firebase/firestore"

async function Editor({ params }: any) {
    const desId = params.docId.split('%')[0]    

    const que = query(collection(db, 'data'), where('userId', '==', params.userId))
    const querySnapshot = await getDocs(que)

    const docId = querySnapshot.docs.map((doc) => doc.id)

    return (
        <DocEditor />
    )
}

export default Editor