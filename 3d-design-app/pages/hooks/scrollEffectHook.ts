import { useEffect, useState } from "react"

function useScrollEffect() {
    const [scrollY, setScrollY] = useState(0)
    const [position, setPosition] = useState(String)
    const [top, setTop] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        if (scrollY >= window.innerHeight) {
            setPosition('fixed')
            setTop(0)
        } else {
            setPosition('absolute')
            setTop(100)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [scrollY])    

    const sectionStyle1: any = {
        xIndex: scrollY > 0 ? 1 : -1
    }

    const sectionStyle2: any = {
        position: position,
        top: `${top}%`,
        xIndex: scrollY > 0 ? 1 : -1
    }

    const sectionStyle3: any = {
        xIndex: scrollY > 0 ? 1 : -1
    }

    return {
        sectionStyle1,
        sectionStyle2,
        sectionStyle3
    }
}

export default useScrollEffect