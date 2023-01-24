'use client';

import { useEffect, useState } from "react";

import show from '../images/show.png'
import hide from '../images/hide.png'

function useInputType(state: boolean) {
    const [image, setImage] = useState(show)
    const [type, setType] = useState('password')

    useEffect(() => {
        if (state) {
            setImage(hide)
            setType('text')
        } else {
            setImage(show)
            setType('password')
        }
    }, [state])

    return {
        image,
        type
    }
}

export default useInputType