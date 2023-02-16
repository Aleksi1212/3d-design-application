'use client';

import { useState } from "react";

import { storage } from "../datalayer/config";
import { ref, getDownloadURL } from "firebase/storage";

function useProfileImage(url: string) {
    const [profileImage, setProfileImage] = useState('') as any
    const errors = [ 'Image not found', 'Access denied', 'Download cancelled', 'Unkown error, check console for details' ]

    if (url.length > 0) {
        const profileImageRef = ref(storage, url)
    
        getDownloadURL(profileImageRef)
            .then((url) => {
                setProfileImage(url)
            })
            .catch((err) => {
                switch (err.code) {
                    case 'storage/object-not-found':
                        setProfileImage(errors[0])
                        break
                    case 'storage/unauthorized':
                        setProfileImage(errors[1])
                        break
                    case 'storage/cancelled':
                        setProfileImage(errors[2])
                        break
                    case 'storage/unkown':
                        setProfileImage(errors[3])
                        break
                }
            })
    }

    return {
        errors,
        profileImage
    }
}

export default useProfileImage