import { db } from "../config"
import { query, collection, where, getDocs, doc, setDoc, updateDoc, arrayUnion, collectionGroup, onSnapshot } from "firebase/firestore"

import { generateId } from "../otherFunctionality"
import images from "../../functions/importImages"

import { useEffect, useState, SetStateAction } from "react"

async function messageUser(senderMessagingId: string, recieverMessagingId: string, senderUserId: string, recieverUserId: string, senderName: string, recieverName: string, message: string, type: string) {
    const currentDate = new Date()

    const messageId1 = generateId(8)
    const messageId2 = generateId(8)

    const querys = {
        sender_query: query(collection(db, 'data'), where('messagingId', '==', senderMessagingId)),
        reciever_query: query(collection(db, 'data'), where('messagingId', '==', recieverMessagingId))
    }

    const sender_snapShot = await getDocs(querys.sender_query)
    const reciever_snapShot = await getDocs(querys.reciever_query)

    const docIds = {
        sender_docId: sender_snapShot.docs.map((doc) => doc.id),
        reciever_docId: reciever_snapShot.docs.map((doc) => doc.id)
    }

    const docRefs = {
        sender_sent_docRef: doc(db, 'data', docIds.sender_docId[0], 'messages', `messagesSentTo-${recieverMessagingId}`),
        sender_recieved_docRef: doc(db, 'data', docIds.sender_docId[0], 'messages', `messagesRecievedFrom-${recieverMessagingId}`),

        reciever_sent_docRef: doc(db, 'data', docIds.reciever_docId[0], 'messages', `messagesSentTo-${senderMessagingId}`),
        reciever_recieved_docRef: doc(db, 'data', docIds.reciever_docId[0], 'messages', `messagesRecievedFrom-${senderMessagingId}`),
    }

    if (type === 'message') {
        const messageUser = await Promise.allSettled([
            updateDoc(docRefs.sender_sent_docRef, {
                'messagesData': arrayUnion({
                    message: message,
                    messageDate: currentDate.toLocaleString(),
                    messageId: messageId1,
                    messageStatus: 'sent',
                    messageType: 'message'
                })
            }),

            updateDoc(docRefs.reciever_recieved_docRef, {
                'messagesData': arrayUnion({
                    message: message,
                    messageDate: currentDate.toLocaleString(),
                    messageId: messageId1,
                    messageStatus: 'recieved',
                    messageType: 'message'
                })
            })
        ])

        return messageUser[0].status === 'fulfilled' ? {
            message: 'Success', image: images.success, type: 'success'
        } : {
            message: messageUser[0].reason.message, image: images.error, type: messageUser[0].reason.constructor.name
        }
    }

    if (type === 'start') {
        const addMessageHistoryPromise = await Promise.allSettled([
            setDoc(docRefs.sender_sent_docRef, {
                messagesData: [
                    {
                        message: `${message} ${senderName}`,
                        messageDate: currentDate.toLocaleString(),
                        messageId: messageId1,
                        messageStatus: 'sent',
                        messageType: 'start'
                    }
                ],
                sentFrom: senderMessagingId,
                recievedBy: recieverMessagingId,
                userId: senderUserId
            }),

            setDoc(docRefs.reciever_recieved_docRef, {
                messagesData: [
                    {
                        message: `${message} ${senderName}`,
                        messageDate: currentDate.toLocaleString(),
                        messageId: messageId1,
                        messageStatus: 'recieved',
                        messageType: 'start'
                    }
                ],
                sentFrom: senderMessagingId,
                recievedBy: recieverMessagingId,
                userId: recieverUserId
            }),

            setDoc(docRefs.reciever_sent_docRef, {
                messagesData: [
                    {
                        message: `${message} ${recieverName}`,
                        messageDate: currentDate.toLocaleString(),
                        messageId: messageId2,
                        messageStatus: 'sent',
                        messageType: 'start'
                    }
                ],
                sentFrom: recieverMessagingId,
                recievedBy: senderMessagingId,
                userId: recieverUserId
            }),

            setDoc(docRefs.sender_recieved_docRef, {
                messagesData: [
                    {
                        message: `${message} ${recieverName}`,
                        messageDate: currentDate.toLocaleString(),
                        messageId: messageId2,
                        messageStatus: 'recieved',
                        messageType: 'start'
                    }
                ],
                sentFrom: recieverMessagingId,
                recievedBy: senderMessagingId,
                userId: senderUserId
            })
        ])

        return addMessageHistoryPromise[0].status === 'fulfilled' ? {
            message: 'Success', image: images.success, type: 'success'
        } : {
            message: addMessageHistoryPromise[0].reason.message, image: images.error, type: addMessageHistoryPromise[0].reason.constructor.name
        }
    }
}

interface messageType {
    message: string
    messageDate: string
    messageId: string
    messageStatus: string
    messageType: string
}

function useGetMessages(messagingId: string, userId: string) {
    const [sentMessages, setSentMessages] = useState([])
    const [recievedMessages, setRecievedMessages] = useState([])

    useEffect(() => {
        const sentMessagesQuery = query(collectionGroup(db, 'messages'), where('recievedBy', '==', messagingId), where('userId', '==', userId))
        const recievedMessagesQuery = query(collectionGroup(db, 'messages'), where('sentFrom', '==', messagingId), where('userId', '==', userId))

        const getSentMessages = onSnapshot(sentMessagesQuery, (querySnapshot) => {
            let sentMessages: SetStateAction<any> = []

            querySnapshot.forEach((sentMessage) => {
                sentMessages = sentMessage.data().messagesData
            })

            setSentMessages(sentMessages)
        })

        const getRecievedMessages = onSnapshot(recievedMessagesQuery, (querySnapshot) => {
            let recievedMessages: SetStateAction<any> = []

            querySnapshot.forEach((recievedMessage) => {
                recievedMessages = recievedMessage.data().messagesData
            })

            setRecievedMessages(recievedMessages)
        })

        return () => {
            getSentMessages()
            getRecievedMessages()
        }
    }, [])

    const messages = sentMessages.concat(recievedMessages)

    return messages.sort((a: messageType, b: messageType) => new Date(Date.parse(a.messageDate)).getTime() - new Date(Date.parse(b.messageDate)).getTime())
}

export {
    messageUser,
    useGetMessages
}