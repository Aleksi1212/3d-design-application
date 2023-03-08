'use client';

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { Canvas } from "@react-three/fiber";
import Scene1 from "../scenes/section1Scene";
import Scene from "../scenes/section2Scene";

import { auth } from "../datalayer/config";

import { cookieSetter } from "../datalayer/otherFunctionality";

interface currentUserTypes {
    state: boolean
    userId: string
}

function StartPage() {
    const titleRef = useRef<HTMLDivElement | any>(null)

    const [scrollPos, setScrollPos] = useState<number>(300)
    const [y, setY] = useState<number>(0)

    const [currentUser, setCurrentUser] = useState<currentUserTypes>({ state: false, userId: '' })

    useEffect(() => {
        const handleScroll = () => {
            setScrollPos(300 - window.scrollY*.4)
            setY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const test = await Promise.allSettled([
                cookieSetter(true, user.uid)
            ])

            test[0].status === 'fulfilled' ? setCurrentUser({ state: true, userId: user.uid }) : null
        }
    }) 

    return (
        <>
            <section className="sections bg-transparent">
                <nav className="flex justify-end p-5 w-full fixed bg-black" 
                    style={{ justifyContent: titleRef.current?.style.fontSize === '40px' ? 'space-between' : 'flex-end', borderBottom: titleRef.current?.style.fontSize === '40px' ? '2px solid #5D5D5D' : 'none' }}>

                    <div ref={titleRef} className="text-white bg-black h-auto w-auto left-10" 
                        style={{ fontSize: scrollPos <= 40 ? '40px' : `${scrollPos}px`, position: titleRef.current?.style.fontSize === '40px' ? 'static' : 'absolute' }}>

                        <h1>Arcus <span className="transition-all duration-500 opacity-0 text-[40px]" 
                            style={{ opacity: y <= 820 ? '0' : titleRef.current?.style.fontSize === '40px' ? '1' : 'none'}}>Design</span>
                        </h1>
                    </div>

                    <div className="flex gap-x-5 pt-[.3rem]">
                        <button className="bg-black w-[7rem] h-[3rem] flex justify-center items-center text-white border-2 rounded-[10px]">
                            <Link href={currentUser.state ? `/dashboard/${currentUser.userId}` : '/logIn'} className="w-full h-full flex justify-center items-center">
                                {currentUser.state ? 'Dashboard' : 'Log In'}
                            </Link>
                        </button>

                        <button className="bg-white w-[7rem] h-[3rem] flex justify-center items-center rounded-[10px]">
                            <Link href="/signUp" className="w-full h-full flex justify-center items-center">Sign Up</Link>
                        </button>
                    </div>

                </nav>

                <div className="w-full h-full flex justify-between">
                    <div className="text-white ml-10 flex flex-col justify-between h-full w-[25rem] pb-5 pt-[32rem]">
                        <h1 className="text-[4rem]">Design Your Own Look!</h1>
                        <h1 className="text-[1.5rem]">Scroll Down To Learn more</h1>
                    </div>
{/* 
                    <div className="w-[60rem]">
                        <Scene1 />
                    </div> */}
                </div>

            </section>

            <section className="sections h-[150vh] flex flex-col justify-end" id="test">
                <div className="w-full h-[60%]">
                    <Scene />
                </div>
            </section>
        </>
    )
}

export default StartPage