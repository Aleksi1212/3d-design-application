import { db } from "../config"
import { query, collection, where, getDocs, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore"

import images from "../../functions/importImages"
import { generateId } from "../otherFunctionality"

async function updateDesign(userId: string, action: string, oldDesignId: string, newName: string) {
    const newDesignId = generateId(8)

    const designQue = query(collection(db, 'dataDesigns'), where('userId', '==', userId))
    const profileQue = query(collection(db, 'data'), where('userId', '==', userId))

    const designQuerySnapshot = await getDocs(designQue)
    const profileQuerySnapshot = await getDocs(profileQue)

    const designDocId = designQuerySnapshot.docs.map((doc) => doc.id)
    const profileDocId = profileQuerySnapshot.docs.map((doc) => doc.id)

    if (action === 'add') {
        const designDocRef = doc(db, 'dataDesigns', designDocId[0], 'designs', newDesignId)
        const profileDocRef = doc(db, 'data', profileDocId[0], 'usersDesigns', newDesignId)
    
        const designPromises = await Promise.allSettled([
            setDoc(designDocRef, {
                designData: {
                    docId: newDesignId,
                    docName: 'Untitled'
                },
                user: userId
            }),

            setDoc(profileDocRef, {
                designData: {
                    docId: newDesignId,
                    docName: 'Untitled'
                },
                user: userId
            })
        ])

        if (designPromises[0].status === 'fulfilled') {
            return { message: 'New Design Created', image: images.success, type: 'success' }
        }

        return { message: designPromises[0].reason.message, image: images.error, type: designPromises[0].reason.constructor.name }

    } else if (action === 'remove') {
        const designDocRef = doc(db, 'dataDesigns', designDocId[0], 'designs', oldDesignId)
        const profileDocRef = doc(db, 'data', profileDocId[0], 'usersDesigns', oldDesignId)

        const deleteDesignPromise = await Promise.allSettled([
            deleteDoc(designDocRef),
            deleteDoc(profileDocRef)
        ])

        if (deleteDesignPromise[0].status === 'fulfilled') {
            return { message: 'Design Deleted', image: images.success, type: 'success' }
        }

        return { message: deleteDesignPromise[0].reason.message, image: images.error, type: deleteDesignPromise[0].reason.constructor.name }

    } else if (action === 'update') {
        const designDocRef = doc(db, 'dataDesigns', designDocId[0], 'designs', oldDesignId)
        const profileDocRef = doc(db, 'data', profileDocId[0], 'usersDesigns', oldDesignId)

        const updateDesignPromise = await Promise.allSettled([
            updateDoc(designDocRef, {
                'designData.docName': newName
            }),

            updateDoc(profileDocRef, {
                'designData.docName': newName
            })
        ])

        if (updateDesignPromise[0].status === 'fulfilled') {
            return { message: `Name Updated To: ${newName}`, image: images.success, type: 'success' }
        }

        return { message: updateDesignPromise[0].reason.message, image: images.error, type: updateDesignPromise[0].reason.constructor.name }
    }
}

export default updateDesign