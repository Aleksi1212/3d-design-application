import { db } from "../../config"
import { query, collection, where, collectionGroup, getDocs, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"

import { generateId } from "../../otherFunctionality"
import images from "../../../functions/importImages"

async function messageUser(senderMessagingId: string, recieverMessagingId: string, senderUserId: string, recieverUserId: string, senderName: string, recieverName: string, message: string, type: string) {
    try {
        const currentDateSent = new Date()
        const currentDateRecieved = new Date()
    
        const messageId1 = generateId(8)
        const messageId2 = generateId(8)
    
        const querys = {
            sender_query: query(collection(db, 'data'), where('messagingId', '==', senderMessagingId)),
            reciever_query: query(collection(db, 'data'), where('messagingId', '==', recieverMessagingId)),

            sentMessagesQuery: query(collectionGroup(db, 'messages'), where('recievedBy', '==', recieverMessagingId), where('userId', '==', senderUserId)),
            recieverMessagesQuery: query(collectionGroup(db, 'messages'), where('sentFrom', '==', recieverMessagingId), where('userId', '==', senderUserId))
        }
    
        const sender_snapShot = await getDocs(querys.sender_query)
        const reciever_snapShot = await getDocs(querys.reciever_query)

        const sentMessages = await getDocs(querys.sentMessagesQuery)
        const recievedMessages = await getDocs(querys.recieverMessagesQuery)
    
        const docsData = {
            sender_docId: sender_snapShot.docs.map((doc) => doc.id),
            reciever_docId: reciever_snapShot.docs.map((doc) => doc.id),

            sentMessagesData: sentMessages.docs.map((doc) => doc.data().messagesData[doc.data().messagesData.length - 1]),
            recievedMessagesData: recievedMessages.docs.map((doc) => doc.data().messagesData[doc.data().messagesData.length - 1])
        }
    
        const docRefs = {
            sender_sent_docRef: doc(db, 'data', docsData.sender_docId[0], 'messages', `messagesSentTo-${recieverMessagingId}`),
            sender_recieved_docRef: doc(db, 'data', docsData.sender_docId[0], 'messages', `messagesRecievedFrom-${recieverMessagingId}`),
    
            reciever_sent_docRef: doc(db, 'data', docsData.reciever_docId[0], 'messages', `messagesSentTo-${senderMessagingId}`),
            reciever_recieved_docRef: doc(db, 'data', docsData.reciever_docId[0], 'messages', `messagesRecievedFrom-${senderMessagingId}`),
        }
    
        if (type === 'message') {
            const messageUser = await Promise.allSettled([
                updateDoc(docRefs.sender_sent_docRef, {
                    'messagesData': arrayUnion({
                        message: message,
                        messageDate: currentDateSent.toLocaleString('en-US'),
                        messageId: messageId1,
                        messageStatus: 'sent',
                        messageType: 'message',
                        show: docsData.sentMessagesData[0].messageType === 'start' ? true :

                        new Date(Date.parse(docsData.sentMessagesData[0].messageDate)).getTime() <= new Date(Date.parse(docsData.recievedMessagesData[0].messageDate)).getTime() ? true :
                        currentDateSent.setMinutes(currentDateSent.getMinutes() - 3) <= new Date(Date.parse(docsData.sentMessagesData[0].messageDate)).getTime() ? false : true

                    })
                }),
    
                updateDoc(docRefs.reciever_recieved_docRef, {
                    'messagesData': arrayUnion({
                        message: message,
                        messageDate: currentDateRecieved.toLocaleString('en-US'),
                        messageId: messageId1,
                        messageStatus: 'recieved',
                        messageType: 'message',
                        show: docsData.sentMessagesData[0].messageType === 'start' ? true :

                        new Date(Date.parse(docsData.sentMessagesData[0].messageDate)).getTime() <= new Date(Date.parse(docsData.recievedMessagesData[0].messageDate)).getTime() ? true :
                        currentDateRecieved.setMinutes(currentDateRecieved.getMinutes() - 3) <= new Date(Date.parse(docsData.sentMessagesData[0].messageDate)).getTime() ? false : true
                    })
                })
            ])
    
            return messageUser[0].status === 'fulfilled' ? {
                message: 'Success', image: images.success, type: 'success'
            } : {
                message: messageUser[0].reason.message, image: images.error, type: messageUser[0].reason.constructor.name
            }
        }
    
        if (type === 'start' && docsData.sentMessagesData.length <= 0) {
            const addMessageHistory = await Promise.allSettled([
                setDoc(docRefs.sender_sent_docRef, {
                    messagesData: [
                        {
                            message: `${message} ${senderName}`,
                            messageDate: currentDateSent.toLocaleString('en-US'),
                            messageId: messageId1,
                            messageStatus: 'sent',
                            messageType: 'start',
                            show: true
                        }
                    ],
                    sentFrom: senderMessagingId,
                    recievedBy: recieverMessagingId,
                    userId: senderUserId,
                    type: 'sender',
                    showHistory: true
                }),
    
                setDoc(docRefs.reciever_recieved_docRef, {
                    messagesData: [
                        {
                            message: `${message} ${senderName}`,
                            messageDate: currentDateRecieved.toLocaleString('en-US'),
                            messageId: messageId1,
                            messageStatus: 'recieved',
                            messageType: 'start',
                            show: true
                        }
                    ],
                    sentFrom: senderMessagingId,
                    recievedBy: recieverMessagingId,
                    userId: recieverUserId,
                    type: 'reciever'
                }),
    
                setDoc(docRefs.reciever_sent_docRef, {
                    messagesData: [
                        {
                            message: `${message} ${recieverName}`,
                            messageDate: currentDateSent.toLocaleString('en-US'),
                            messageId: messageId2,
                            messageStatus: 'sent',
                            messageType: 'start',
                            show: true
                        }
                    ],
                    sentFrom: recieverMessagingId,
                    recievedBy: senderMessagingId,
                    userId: recieverUserId,
                    type: 'sender',
                    showHistory: true
                }),
    
                setDoc(docRefs.sender_recieved_docRef, {
                    messagesData: [
                        {
                            message: `${message} ${recieverName}`,
                            messageDate: currentDateRecieved.toLocaleString('en-US'),
                            messageId: messageId2,
                            messageStatus: 'recieved',
                            messageType: 'start',
                            show: true
                        }
                    ],
                    sentFrom: recieverMessagingId,
                    recievedBy: senderMessagingId,
                    userId: senderUserId,
                    type: 'receiver'
                })
            ])
    
            return addMessageHistory[0].status === 'fulfilled' ? {
                message: 'Success', image: images.success, type: 'success'
            } : {
                message: addMessageHistory[0].reason.message, image: images.error, type: addMessageHistory[0].reason.constructor.name
            }

        } else {
            const setVisibility = await Promise.allSettled([
                updateDoc(docRefs.sender_sent_docRef, {
                    'showHistory': true
                })
            ])

            return setVisibility[0].status === 'fulfilled' ? {
                message: 'Success', image: images.success, type: 'success'
            } : {
                message: setVisibility[0].reason.message, image: images.error, type: setVisibility[0].reason.constructor.name
            }
        }

    } catch(err) {
        return { message: 'Error sending message', image: images.error, type: 'error' }
    }
}

export default messageUser