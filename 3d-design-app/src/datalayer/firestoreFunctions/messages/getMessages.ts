import { useState, useEffect } from 'react'
import useUserData from '../../../hooks/userDataHook'

import { db } from '../../config'
import { query, collectionGroup, where, onSnapshot } from 'firebase/firestore'

interface messageType {
    message: string
    messageDate: string
    messageId: string
    messageStatus: string
    messageType: string
    show: boolean
}

function useGetMessages(messagingId: string, userId: string) {
    const [sentMessages, setSentMessages] = useState<Array<messageType>>([])
    const [recievedMessages, setRecievedMessages] = useState<Array<messageType>>([])

    const senderUserData = useUserData({ type: 'userId', id: userId })

    useEffect(() => {
        const sentMessagesQuery = query(collectionGroup(db, 'messages'), where('recievedBy', '==', messagingId), where('userId', '==', userId))
        const recievedMessagesQuery = query(collectionGroup(db, 'messages'), where('sentFrom', '==', messagingId), where('userId', '==', userId))

        const getSentMessages = onSnapshot(sentMessagesQuery, (querySnapshot) => {
            let sentMessages: Array<messageType> = []

            querySnapshot.forEach((sentMessage) => {
                sentMessages = sentMessage.data().messagesData
            })

            setSentMessages(sentMessages)
        })

        const getRecievedMessages = onSnapshot(recievedMessagesQuery, (querySnapshot) => {
            let recievedMessages: Array<messageType> = []

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

    const messagesMerged = sentMessages.concat(recievedMessages)

    return {
        messages: messagesMerged.sort((a: messageType, b: messageType) => new Date(Date.parse(a.messageDate)).getTime() - new Date(Date.parse(b.messageDate)).getTime()),
        senderUserData: senderUserData
    }
}

export default useGetMessages