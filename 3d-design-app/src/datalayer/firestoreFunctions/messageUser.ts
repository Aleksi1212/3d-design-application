import { db } from "../config"
import { query, collection, where, getDocs, doc, setDoc } from "firebase/firestore"

import { generateId } from "../otherFunctionality"
import images from "../../functions/importImages"

async function messageUser(senderId: string, recieverId: string, senderName: string, recieverName: string, message: string, type: string) {
    const currentDate = new Date()

    const messageId1 = generateId(8)
    const messageId2 = generateId(8)

    const querys = {
        sender_query: query(collection(db, 'data'), where('messagingId', '==', senderId)),
        reciever_query: query(collection(db, 'data'), where('messagingId', '==', recieverId))
    }

    const sender_snapShot = await getDocs(querys.sender_query)
    const reciever_snapShot = await getDocs(querys.reciever_query)

    const docIds = {
        sender_docId: sender_snapShot.docs.map((doc) => doc.id),
        reciever_docId: reciever_snapShot.docs.map((doc) => doc.id)
    }

    const docRefs = {
        sender_sent_docRef: doc(db, 'data', docIds.sender_docId[0], `messagesSentTo-${recieverId}`, messageId1),
        sender_recieved_docRef: doc(db, 'data', docIds.sender_docId[0], `messagesRecievedFrom-${recieverId}`, messageId2),

        reciever_sent_docRef: doc(db, 'data', docIds.reciever_docId[0], `messagesSentTo-${senderId}`, messageId2),
        reciever_recieved_docRef: doc(db, 'data', docIds.reciever_docId[0], `messagesRecievedFrom-${senderId}`, messageId1),
    }

    if (type === 'start') {
        const addMessageHistoryPromise = await Promise.allSettled([
            setDoc(docRefs.sender_sent_docRef, {
                messageData: {
                    message: `${message} ${senderName}`,
                    messageSent: currentDate.toDateString(),
                    messageId: messageId1,
                    messageType: 'start'
                },
                sentFrom: senderId,
                recievedBy: recieverId
            }),

            setDoc(docRefs.reciever_recieved_docRef, {
                messageData: {
                    message: `${message} ${senderName}`,
                    messageRecieved: currentDate.toDateString(),
                    messageId: messageId1,
                    messageType: 'start'
                },
                sentFrom: senderId,
                recievedBy: recieverId
            }),

            setDoc(docRefs.reciever_sent_docRef, {
                messageData: {
                    message: `${message} ${recieverName}`,
                    messageSent: currentDate.toDateString(),
                    messageId: messageId2,
                    messageType: 'start'
                },
                sentFrom: recieverId,
                recievedBy: senderId
            }),

            setDoc(docRefs.sender_recieved_docRef, {
                messageData: {
                    message: `${message} ${recieverName}`,
                    messageRecieved: currentDate.toDateString(),
                    messageId: messageId2,
                    messageType: 'start'
                },
                sentFrom: recieverId,
                recievedBy: senderId
            })
        ])

        return addMessageHistoryPromise[0].status === 'fulfilled' ? {
            message: 'Success', image: images.success, type: 'success'
        } : {
            message: addMessageHistoryPromise[0].reason.message, image: images.error, type: addMessageHistoryPromise[0].reason.constructor.name
        }
    }
}

export default messageUser