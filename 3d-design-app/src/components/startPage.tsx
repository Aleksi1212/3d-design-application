'use client';

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { Canvas } from "@react-three/fiber";
import Grid from "../scenes/section1Scene";
import Scene from "../scenes/section2Scene";

function StartPage() {
    const titleRef = useRef<HTMLDivElement | any>(null)


    const [scrollPos, setScrollPos] = useState<number>(300)
    const [y, setY] = useState<number>(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollPos(300 - window.scrollY*.4)
            setY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <section className="sections bg-transparent">
                {/* <div className="fixed top-0 w-full h-[100vh]">
                    <Canvas>
                    <Grid />
                    </Canvas>
                </div> */}


                <nav className="flex justify-end p-8 w-full fixed bg-black" 
                    style={{ justifyContent: titleRef.current?.style.fontSize === '40px' ? 'space-between' : 'flex-end', borderBottom: titleRef.current?.style.fontSize === '40px' ? '2px solid #5D5D5D' : 'none' }}>
                    {/* <div className="absolute w-[10rem] h-[10rem] bg-white text-black">{y}</div> */}

                    <div ref={titleRef} className="text-white bg-black h-auto w-auto left-10" 
                        style={{ fontSize: scrollPos <= 40 ? '40px' : `${scrollPos}px`, position: titleRef.current?.style.fontSize === '40px' ? 'static' : 'absolute' }}>

                        <h1>Arcus <span className="transition-all duration-500 opacity-0 text-[40px]" 
                            style={{ opacity: y <= 820 ? '0' : titleRef.current?.style.fontSize === '40px' ? '1' : 'none'}}>Design</span>
                        </h1>

                        {/* <div className="h-auto flex flex-col justify-center pt-10">
                            <Image src={logo} alt="logo" className="w-56 h-56" />
                        </div> */}
                    </div>

                    <div className="flex gap-x-6 pt-1">
                        <button className="bg-black w-[7rem] h-[3rem] flex justify-center items-center text-white border-2 rounded-[10px]">
                            <Link href="/logIn" className="w-full h-full flex justify-center items-center">Log In</Link>
                        </button>

                        <button className="bg-white w-[7rem] h-[3rem] flex justify-center items-center rounded-[10px]">
                            <Link href="/signUp" className="w-full h-full flex justify-center items-center">Sign Up</Link>
                        </button>
                    </div>

                </nav>

                <div className="text-white ml-10 flex flex-col justify-between h-full w-[25rem] pb-5 pt-[32rem]">
                    <h1 className="text-[4rem]">Design Your Own Look!</h1>
                    <h1 className="text-[1.5rem]">Scroll Down To Learn more</h1>
                </div>

                {/* <div className="text-white ml-10 inline-block bg-red-500 h-full">
                    <div className="flex justify-between w-auto">
                        <div className="h-auto flex flex-col justify-center">
                            <Image src={logo} alt="logo" className="w-56 h-56 " />
                        </div>
                    </div>
                    <div className="text-[4rem] mt-10">
                        <h1>Design Your</h1>
                        <h1>Own Look!</h1>
                    </div>
                </div>

                <div className="text-white text-[1.5rem] ml-10 absolute bottom-10 flex justify-between w-[22rem]">
                    <h1>Scroll Down To Learn More</h1>
                    <Image src={arrow} alt="arrow" ref={arrowRef} width={35} />
                </div> */}
            </section>

            <section className="sections bg-[#2B32B2]">
                <div className="w-full h-full">
                    <Scene />
                </div>
            </section>

            <section className="h-[100vh] w-full bg-red-500"></section>

            {/* <section className="lastSection">
                <div className="w-full h-[40%]">
                    <Canvas camera={{ position: [0, 10, 20] }}>
                        <Grid />
                    </Canvas>
                </div>
                <div className="w-full flex justify-evenly">

                    <div className="h-[45rem] flex flex-col justify-between items-center">
                        <div className="w-[25rem] h-[20rem] rounded-lg text-cyan-300 text-2xl flex justify-center items-center">
                            <h1>Free And Open Source</h1>
                        </div>
                        
                        <Link href="/signUp" className="button">
                            Get Started
                        </Link>
                    </div>

                    <div className="h-[45rem] flex flex-col justify-between items-center">
                        <div className="w-[25rem] h-[20rem] rounded-lg text-cyan-300 text-2xl flex justify-center items-center">
                            <h1>High Quality</h1>
                        </div>

                        <Link href="/" className="button">
                            Back To Top
                        </Link>
                    </div>
                </div>
            </section> */}
        </>
    )
}

export default StartPage