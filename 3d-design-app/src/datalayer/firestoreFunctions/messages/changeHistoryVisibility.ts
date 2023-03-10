import { db } from "../../config";
import { query, where, collection, doc, getDocs, updateDoc } from "firebase/firestore";

import images from "../../../functions/importImages";

async function changeHistoryVisibility(userId: string, messagingId: string) {
    try {
        const senderDocs = query(collection(db, 'data'), where('userId', '==', userId))
    
        const querySnapshot = await getDocs(senderDocs)
        const docId = querySnapshot.docs.map((doc) => doc.id)
    
        const senderDocRef = doc(db, 'data', docId[0], 'messages', `messagesSentTo-${messagingId}`)


        const changeVisiblity = await Promise.allSettled([
            updateDoc(senderDocRef, {
                'showHistory': false
            })
        ])

        return changeVisiblity[0].status === 'fulfilled' ? {
            message: 'Conversation Closed', image: images.success, type: 'success'
        } : {
            message: changeVisiblity[0].reason.message, image: images.error, type: changeVisiblity[0].reason.constructor.name
        }

    } catch(err: any) {
        return { message: err.message, image: images.error, type: 'error' }
    }
}

export default changeHistoryVisibility