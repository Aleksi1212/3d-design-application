'use client';

import images from "../../functions/importImages";

import Image from 'next/image'

function MessageSideBar() {
    return (
        <div className="h-full w-[20%] bg-white relative">
            <div className="absolute top-0 w-full h-[9%] border-b-2 border-[#D2D2D2] flex justify-center items-center">
                <div className="w-[90%] h-[2rem] flex justify-between items-center shadow-md rounded-md">
                    <Image src={images.search} alt="search" width={20} height={20} className="absolute pointer-events-none left-6" />
                    <input type="text" placeholder="Find or start a conversation" className="w-full h-[2rem] bg-[#F6F7F9] rounded-md pl-8" />
                </div>
            </div>

            <div className="absolute bottom-0 w-full h-[9%] border-t-2 border-[#D2D2D2]"></div>
        </div>
    )
}

export default MessageSideBar