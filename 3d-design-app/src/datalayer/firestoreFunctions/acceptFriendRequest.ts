import { db } from "../config"
import { query, collection, where, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore"

import images from "../../functions/importImages"

async function acceptFriendRequest(sentToId: string, sentFromId: string, sentFromName: string, sentFromMessagingId: string) {
    const querys = {
        sentToQuery: query(collection(db, 'data'), where('userId', '==', sentToId)),
        sentFromQuery: query(collection(db, 'data'), where('userId', '==', sentFromId))
    }

    const sentToSnapShot = await getDocs(querys.sentToQuery)
    const sentFromSnapShot = await getDocs(querys.sentFromQuery)

    const docIds = {
        sentToDocId: sentToSnapShot.docs.map((doc) => doc.id),
        sentFromDocId: sentFromSnapShot.docs.map((doc) => doc.id)
    }

    const docRefs = {
        sentToDocRef: doc(db, 'data', docIds.sentToDocId[0], 'friendRequests', sentFromId), 
        sentFromDocRef: doc(db, 'data', docIds.sentFromDocId[0], 'friends', sentToId),
        addFriendRef: doc(db, 'data', docIds.sentToDocId[0], 'friends', sentFromId)
    }

    const acceptRequestPromise = await Promise.allSettled([
        deleteDoc(docRefs.sentToDocRef),
        updateDoc(docRefs.sentFromDocRef, {
            'state': 'accepted'
        }),

        setDoc(docRefs.addFriendRef, {
            friendData: {
                friendId: sentFromId,
                friendName: sentFromName,
                messagingId: sentFromMessagingId
            },
            state: 'accepted',
            user: sentToId
        })
    ])

    return acceptRequestPromise[0].status === 'fulfilled' ? {
        message: 'Friend Added', image: images.success, type: 'success'
    } : {
        message: acceptRequestPromise[0].reason.message, image: images.error, type: acceptRequestPromise[0].reason.constructor.name
    }
}

export default acceptFriendRequest