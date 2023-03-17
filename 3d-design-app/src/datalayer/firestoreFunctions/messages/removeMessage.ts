import { db } from "../../config";
import { query, collection, where, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore";

import images from "../../../functions/importImages";
import { StaticImageData } from "next/image";

interface messageType {
    message: string
    messageDate: string
    messageId: string
    messageStatus: string
    messageType: string
    show: boolean
}

interface returnType {
    message: string
    image: StaticImageData
    type: string
}

async function removeMessage(messageData: messageType, from: string, reciverMessagingId: string, senderMessagingId: string) {
    try {
        const senderQuery = query(collection(db, 'data'), where('messagingId', '==', senderMessagingId))
        const recieverQuery = query(collection(db, 'data'), where('messagingId', '==', reciverMessagingId))

        const senderSnapshot = await getDocs(senderQuery)
        const reciverSnapshot = await getDocs(recieverQuery)

        const docIds = {
            senderDocId: senderSnapshot.docs.map((doc) => doc.id),
            reciverDocId: reciverSnapshot.docs.map((doc) => doc.id)
        }

        const docRefs = {
            senderDocRef: doc(db, 'data', docIds.senderDocId[0], 'messages', `messagesSentTo-${reciverMessagingId}`),
            recieverDocRef: doc(db, 'data', docIds.reciverDocId[0], 'messages', `messagesRecievedFrom-${senderMessagingId}`)
        }

        if (from === 'all') {
            const removeFromAll = await Promise.allSettled([
                updateDoc(docRefs.senderDocRef, {
                    'messagesData': arrayRemove(messageData)
                }),

                updateDoc(docRefs.recieverDocRef, {
                    'messagesData': arrayRemove({ ...messageData, messageStatus: 'recieved' })
                })
            ])

            return (
                removeFromAll[0].status === 'fulfilled' ? {
                    message: 'Message Removed From Everyone', image: images.success, type: 'success'
                } : {
                    message: removeFromAll[0].reason.message, image: images.error, type: removeFromAll[0].reason.constructor.name
                }
            ) as returnType

        } else if (from === 'self') {
            const removeFromSelf = await Promise.allSettled([
                updateDoc(docRefs.senderDocRef, {
                    'messagesData': arrayRemove(messageData)
                })
            ])

            return (
                removeFromSelf[0].status === 'fulfilled' ? {
                    message: 'Message Removed From Everyone', image: images.success, type: 'success'
                } : {
                    message: removeFromSelf[0].reason.message, image: images.error, type: removeFromSelf[0].reason.constructor.name
                }
            ) as returnType
        }

        return { message: 'Unkown error', image: images.error, type: 'error' } as returnType

    } catch(err: any) {
        return { message: 'Error removing message', image: images.error, type: err.constructor.name } as returnType
    } 
}

export default removeMessage