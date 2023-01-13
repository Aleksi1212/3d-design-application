'use client';

import { useRef } from "react";
import useScrollEffect from "../hooks/scrollEffectHook";
import Image from "next/image";
import Link from "next/link";

import logo from '../images/logo.png'
import arrow from '../images/arrowDown.png'
import { gsap } from "gsap";

import { Canvas } from "@react-three/fiber";
import Grid from "../scenes/section1Scene";
import Scene from "../scenes/section2Scene";

import Typewriter from 'typewriter-effect'

function StartPage() {
    const scrollEffect = useScrollEffect()
    const arrowRef = useRef<HTMLImageElement>(null)

    const tl = gsap.timeline({ defaults: {duration: .75} })
    tl.fromTo(arrowRef.current, {y: 0}, {y: -20, yoyo: true, repeat: Infinity})

    return (
        <>
            <section style={scrollEffect.sectionStyle1} className="sections bg-transparent fixed top-0">
                <div className="fixed top-0 w-full h-[100vh]">
                    <Canvas>
                        <Grid />
                    </Canvas>
                </div>

                <nav className="flex justify-end h-16 w-full absolute">
                    <div className="flex justify-evenly w-72 pt-5 mr-5">
                        <button className="bg-black w-[7rem] h-[3rem] flex justify-center items-center text-white border-2 rounded-[10px]">
                            <Link href="/logIn" className="w-full h-full flex justify-center items-center">Log In</Link>
                        </button>

                        <button className="bg-white w-[7rem] h-[3rem] flex justify-center items-center rounded-[10px]">
                            <Link href="/signUp" className="w-full h-full flex justify-center items-center">Sign Up</Link>
                        </button>
                    </div>
                </nav>

                <div className="text-white text-[20rem] ml-10 inline-block">
                    <div className="flex justify-between w-auto">
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter
                                .typeString("Arcus")
                                .pauseFor(1000)
                                .deleteAll()
                                .typeString("Designs")
                                .pauseFor(1000)
                                .deleteAll()
                                .typeString("Arcus")
                                .start() 
                            }}
                        />
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
                </div>
            </section>

            <section style={scrollEffect.sectionStyle2} className="sections bg-[#2B32B2]">
                <div className="w-full h-full absolute">
                    <Scene />
                </div>
            </section>

            <section style={scrollEffect.sectionStyle3} className="lastSection absolute top-[200%]">
                <div className="w-full h-[40%]">
                    <Canvas camera={{ position: [0, 10, 20] }}>
                        <Grid />
                    </Canvas>
                </div>
                <div className="absolute w-full flex justify-evenly top-[40%]">

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
            </section>
        </>
    )
}

export default StartPage