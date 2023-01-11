import { useRef } from "react"
import useScrollEffect from "./hooks/scrollEffectHook"
import Image from "next/image"

import logo from '../public/images/logo.png'
import arrow from '../public/images/arrowDown.png'
import { gsap } from "gsap"

import { Canvas } from '@react-three/fiber'
import Section1Scene from "./scenes/Section1scene"
import Blob from "./scenes/Section2scenes"

import Typewriter from "typewriter-effect";

function Start() {
    const scrollEffect = useScrollEffect()
    const arrowRef = useRef<HTMLImageElement>(null)
    
    const tl = gsap.timeline({defaults: {duration: .75}})
    
    tl.fromTo(arrowRef.current, {y: 0}, {y: -20, yoyo: true, repeat: Infinity})
    
    return (
        <>
            <section style={scrollEffect.sectionStyle1} className="sections bg-transparent fixed top-0">
                <div className="fixed top-0 w-full h-[100vh]">
                    <Canvas>
                        <Section1Scene />
                    </Canvas>
                </div>

                <nav className="flex justify-end h-16 w-full absolute">
                    <div className="flex justify-evenly w-72 pt-5 mr-5">
                        <button className="bg-black w-[7rem] h-[3rem] flex justify-center items-center text-white border-2 rounded-[10px]">
                            <a href="">Log In</a>
                        </button>

                        <button className="bg-white w-[7rem] h-[3rem] flex justify-center items-center rounded-[10px]">
                            <a href="">Sign Up</a>
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

                <div className="text-white text-[1.5rem] ml-10 absolute bottom-10 flex justify-between w-[21rem]">
                    <h1>Scroll Down To Learn More</h1>
                    <Image src={arrow} alt="arrow" ref={arrowRef} width={35} />
                </div>
            </section>

            <section style={scrollEffect.sectionStyle2} className="sections bg-[#5CDB95]">
                <div className="absolute w-full h-[100vh]">
                    <Canvas camera={{ position: [0, 0, 7] }}>
                        <Blob hover={1} speed={.4} />
                    </Canvas>
                </div>

                <div className="absolute w-[20rem] h-[20rem] right-20">
                    <Canvas camera={{ position: [0, 0, 10] }}>
                        <Blob hover={.5} speed={.7} />
                    </Canvas>
                </div>

                <div className="absolute w-[20rem] h-[20rem] bottom-36">
                    <Canvas camera={{ position: [0, 0, 12] }}>
                        <Blob hover={.6} speed={.2} />
                    </Canvas>
                </div>

                <div className="absolute w-[20rem] h-[20rem] left-[37rem] top-10">
                    <Canvas camera={{ position: [0, 0, 6] }}>
                        <Blob hover={.8} speed={.3} />
                    </Canvas>
                </div>

                <div className="absolute w-[20rem] h-[20rem] right-40 bottom-0">
                    <Canvas camera={{ position: [0, 0, 6] }}>
                        <Blob hover={.9} speed={.5} />
                    </Canvas>
                </div>

                <div className="flex justify-center items-center w-full h-[100vh]">
                    <div className="inline-block absolute">
                        <h1 className="text-[1.2rem] text-white">START DESIGNING YOUR LOOKS WITH</h1>
                        <h1 className="flex justify-center text-[7rem] text-white opacity-50 mt-[-1.5rem]">Arcus</h1>
                    </div>
                </div>
            </section>

            <section style={scrollEffect.sectionStyle3} className="lastSection absolute top-[200%]">
                <div className="absolute w-full flex justify-evenly top-[40%]">

                    <div className="h-[45rem] flex flex-col justify-between items-center">
                        <div className="box w-[25rem] h-[20rem] shadow-xl text-cyan-300 text-2xl flex justify-center items-center">
                            <h1>Free And Open Source</h1>
                        </div>
                        
                        <button className="bg-cyan-300 rounded-[50px] w-[15rem] h-[5rem] text-2xl font-medium shadow-xl">
                            <a href="">Get Started</a>
                        </button>
                    </div>

                    <div className="h-[45rem] flex flex-col justify-between items-center">
                        <div className="box w-[25rem] h-[20rem] shadow-xl text-cyan-300 text-2xl flex justify-center items-center">
                            <h1>High Quality</h1>
                        </div>
                        
                        <button className="bg-cyan-300 rounded-[50px] w-[15rem] h-[5rem] text-2xl font-medium shadow-xl">
                            <a href="">Back To Top</a>
                        </button>
                    </div>
                </div>

            </section>
        </>
    )
}

export default Start