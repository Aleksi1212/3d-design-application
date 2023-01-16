'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

import arrow1 from '../images/arrow1.png'
// import arrow1_2 from '../images/arrow1-2.svg'

function UserHome() {
    return (
        <section className="bg-[#F6F7F9] absolute w-full h-[100vh]">
            <div className="bg-[#1A73E8] h-[40%]">
                {/* <Image src={arrow1} alt="arrow1" /> */}
            </div>
        </section>
    ) 
}

export default UserHome