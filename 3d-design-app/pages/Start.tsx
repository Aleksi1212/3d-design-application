import { useRef } from "react"
import useScrollEffect from "./hooks/scrollEffectHook"
import Image from "next/image"

import logo from '../public/images/logo.png'
import arrow from '../public/images/arrowDown.png'
import { gsap } from "gsap"

import { Canvas } from '@react-three/fiber'
import Section1Scene from "./scenes/Section1scene"
import Blob from "./scenes/Section2scenes"

function Start() {
    const scrollEffect = useScrollEffect()
    const arrowRef = useRef<HTMLImageElement>(null)
    
    const tl = gsap.timeline({defaults: {duration: .75}})
    
    tl.fromTo(arrowRef.current, {y: 0}, {y: -20, yoyo: true, repeat: Infinity})
    
    return (
        <>
            <section style={scrollEffect.sectionStyle1} className="sections fixed bg-transparent top-0">
                <div className="fixed top-0 left-0 w-full h-[100vh]">
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

                <div className="text-white text-[20rem] inline-block ml-10">
                    <h1>Arcus</h1>
                    <Image className="ml-[50rem] mt-[-19rem]" src={logo} alt="logo" />
                    <div className="text-[4rem] w-[40%] mt-10">
                        <h1>Design Your Own Look!</h1>
                    </div>
                </div>

                <div className="text-white text-[1.5rem] ml-10 absolute bottom-10 flex justify-between w-[21rem]">
                    <h1>Scroll Down To Learn More</h1>
                    <Image src={arrow} alt="arrow" ref={arrowRef} width={35} />
                </div>
            </section>

            <section style={scrollEffect.sectionStyle2} className="sections bg-[#F55D50]">
                <div className="absolute h-[35rem] w-[35rem] bottom-0 left-[40rem]">
                    <Canvas camera={{ position: [0, 0, 7] }}>
                        <Blob />
                    </Canvas>
                </div>

                {/* <div className="absolute h-[20rem] right-20">
                    <Canvas camera={{ position: [0, 0, 10] }}>
                        <Section2Scene hover={.5} speed={.7} />
                    </Canvas>
                </div>

                <div className="absolute h-[20rem] bottom-36">
                    <Canvas camera={{ position: [0, 0, 12] }}>
                        <Section2Scene hover={.6} speed={.2} />
                    </Canvas>
                </div>

                <div className="absolute h-[20rem] left-[37rem] top-10 ">
                    <Canvas camera={{ position: [0, 0, 6] }}>
                        <Section2Scene hover={.8} speed={.3} />
                    </Canvas>
                </div> */}

                <div className="inline-block absolute top-96 left-96">
                    <h1 className="text-[1.2rem] text-white opacity-50">START DESIGNING YOUR LOOKS WITH</h1>
                    <h1 className="flex justify-end text-[7rem] text-white mt-[-1.5rem]">Arcus</h1>
                </div>
            </section>

            <section style={scrollEffect.sectionStyle3} className="sections bg-blue-500 absolute top-[200%]">
                <h1>test</h1>
            </section>
        </>
    )
}

export default Start