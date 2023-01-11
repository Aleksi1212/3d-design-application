import { useEffect, useState} from 'react'

function getWindowDimensions() {
    const {
        innerWidth: width,
        innerHeight: height
    } = window

    return {
        width,
        height
    }
}

function useWindowDimensions() {
    const [windowDImensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDImensions
}

export default useWindowDimensions