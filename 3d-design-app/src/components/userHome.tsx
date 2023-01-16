'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

import arrow1 from '../images/arrow1.svg'
import arrow2 from '../images/arrow2.svg'
import arrow3 from '../images/arrow3.svg'
import cross from '../images/cross.svg'

function UserHome() {
    return (
        <section className="bg-[#F6F7F9] w-full h-[150vh]">
            <div className="bg-[#1A73E8] h-[30%] flex">
                <div className="flex flex-col justify-end pb-20 pl-24">
                    <Image src={arrow1} alt="arrow1" />
                </div>
                
                <div className="flex flex-col justify-start pt-16 pl-72">
                    <Image src={cross} alt="cross" />
                </div>

                <div className="flex flex-col justify-center pl-[30rem]">
                    <Image src={arrow2} alt="arrow2" />
                </div>

                <div className="flex flex-col justify-end pl-96 pb-10">
                    <Image src={arrow3} alt="arrow3" />
                </div>
            </div>
        </section>
    ) 
}

export default UserHome