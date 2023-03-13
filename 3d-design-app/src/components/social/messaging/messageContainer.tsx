'use client';

import Image from "next/image";
import images from "../../../functions/importImages";

import { useState, Fragment } from "react";
import ProfileBox from "../../styledComponents/profileBox";

interface profileTypes {
    profileImage: any
    errors: Array<string>
}

interface messageBoxtype {
    message: string
    messageDate: string
    messageId: string
    messageStatus: string
    messageType: string
    sentFromName: string
    show: boolean
    profileData: profileTypes
    profileUrl: string
}

interface messageDataTypes {
    messageData: messageBoxtype
}

interface hoverTypes {
    hovered: boolean
    clicked: boolean
}


function Message({ messageData }: messageDataTypes) {
    const { message, messageDate, messageId, messageStatus, messageType, sentFromName, profileData, profileUrl, show } = messageData || {}

    const [hoverState, setHoverState] = useState<hoverTypes>({ hovered: false, clicked: false })

    if (!show) {
        return (
            <div className="flex flex-col w-max -mt-5 mb-6">
                <div className="ml-14 max-w-[60rem] text-lg relative" id="messageContainer" style={{ overflowWrap: 'break-word' }}
                    onMouseEnter={() => setHoverState({ hovered: true, clicked: hoverState.clicked })}
                    onMouseLeave={() => setHoverState({ hovered: false, clicked: false })}
                >
                    <p id="messageDate" className="scale-0 absolute text-xs left-[-5rem] top-[.45rem] w-[4.5rem] text-center opacity-70">{messageDate.split(', ')[1]}</p>
                    
                    <button className="absolute right-[-2rem] w-[2rem] flex justify-center items-center pt-1" style={{ scale: hoverState.hovered && !hoverState.clicked ? '1' : '0' }}
                        onMouseEnter={() => setHoverState({ hovered: true, clicked: hoverState.clicked })}
                        onClick={() => setHoverState({ hovered: hoverState.hovered, clicked: true })}
                    >
                        <Image src={images.docRemove} alt="remove" width={20} height={20} />
                    </button>

                    <div className="absolute bg-[#5D5D5D] flex h-5 rounded-lg right-[-12.5rem] top-1 text-xs text-[#F6F7F9]"
                        style={{ scale: hoverState.clicked ? '1' : '0' }}
                    >
                        <button className="w-[6rem] hover:opacity-70 rounded-l-md border-r">From Myself</button>
                        <button className="w-[6rem] hover:opacity-70 rounded-r-md">From Everyone</button>
                    </div>

                    {
                        message.split('\n').map((value: string, index: number, arr: Array<string>) => {
                            return <Fragment key={index}>
                                {value}
                                {index !== arr.length - 1 && <br />}
                            </Fragment>
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-max my-6">
            <div className="flex gap-x-2">
                <ProfileBox styles={{
                    dimensions: '3rem',
                    backgroundColor: 'white',
                    bold: true,

                    userName: sentFromName,
                    info: messageDate,
                    profileImage: profileData,
                    profileUrl: profileUrl
                }} />
            </div>

            <div className="ml-14 max-w-[60rem] text-lg relative" style={{ overflowWrap: 'break-word' }}
                onMouseEnter={() => setHoverState({ hovered: true, clicked: hoverState.clicked })}
                onMouseLeave={() => setHoverState({ hovered: false, clicked: false })}
            >
                <button className="absolute right-[-2rem] w-[2rem] flex justify-center items-center pt-1" style={{ scale: hoverState.hovered && !hoverState.clicked ? '1' : '0' }}
                    onMouseEnter={() => setHoverState({ hovered: true, clicked: hoverState.clicked })}
                    onClick={() => setHoverState({ hovered: hoverState.hovered, clicked: true })}
                >
                    <Image src={images.docRemove} alt="remove" width={20} height={20} />
                </button>

                <div className="absolute bg-[#5D5D5D] flex h-5 rounded-lg right-[-12.5rem] top-1 text-xs text-[#F6F7F9]"
                    style={{ scale: hoverState.clicked ? '1' : '0' }}
                >
                    <button className="w-[6rem] hover:opacity-70 rounded-l-md border-r">From Myself</button>
                    <button className="w-[6rem] hover:opacity-70 rounded-r-md">From Everyone</button>
                </div>

                {
                    message.split('\n').map((value: string, index: number, arr: Array<string>) => {
                        return <Fragment key={index}>
                            {value}
                            {index !== arr.length - 1 && <br />}
                        </Fragment>
                    })
                }
            </div>
        </div>
    )
}

export default Message