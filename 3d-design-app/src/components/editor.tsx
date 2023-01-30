'use client';

import Image from "next/image"

import expand from '../images/expand.png'
import add from '../images/add.png'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";

import { db } from "../datalayer/config";
import { updateDesign } from "../datalayer/querys";
import { collectionGroup, onSnapshot, query, where } from "firebase/firestore";

function DocEditor({ designData }: any) {
    const { user, docId, docName } = designData || {}

    const router = useRouter()

    const [system, setSystem] = useState('metric')
    const [mesTypes, setMesTypes] = useState({ large: ['m', 'kg'], small: ['cm', 'g'] })

    const [desName, setDesName] = useState(docName)

    const editProps = ['Hat', 'Glasses', 'Shirt', 'Hoodie / Jacket', 'Pants', 'Socks', 'Shoes']

    useEffect(() => {
        const que = query(collectionGroup(db, 'designs'), where('user', '==', user), where('designData.docId', '==', docId))

        const getDocNameRealTime = onSnapshot(que, (querySnapshot) => {
            let data: any = []
            querySnapshot.forEach((doc) => {
                data.push(doc.data().designData.docName)
            })

            setDesName(data[0])
        }) 

        return () => getDocNameRealTime()
    }, [])

    function updateName(event: any) {
        event.preventDefault()

        const newName = event.target.desName.value
        updateDesign(user, 'update', docId, newName)

        router.replace(`/document/${user}/${docId}=${desName}`)
    }

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.width = `${(inputRef.current.value.length + 1) * 15}px`
        }
    }, [inputRef.current])
    
    return (
        <section className="w-full h-full absolute bg-[#2D2D2D] text-white">
            <nav className="w-full h-[5rem] absolute flex justify-center items-center border-b-[1px] border-[#808080] bg-[#2D2D2D]">
                <div className="flex text-xl">
                    <h1>Design /</h1>
                    
                    <form onSubmit={updateName} className="w-auto">
                        <input type="text" value={desName} className="bg-[#2D2D2D] outline-none opacity-50 pl-1" name="desName" ref={inputRef}
                            onChange={(e) => setDesName(e.target.value)} />
                    </form>
                </div>
            </nav>

            <div className="w-full h-full flex justify-evenly">
                <div className="h-full w-[20rem] border-r-[1px] border-[#808080]">
                    <div className="w-full h-[4rem] relative top-[5rem] border-b-[1px] border-[#808080] text-lg flex items-center justify-between pr-12">
                        <h1 className="pl-5">Design - 1</h1>
                        <Image src={expand} alt="expand" />
                    </div>

                    <div className="relative top-[6rem] w-full">
                        {
                            editProps.map((editorBox) => {
                                return <EditorBox data={editorBox} key={editorBox} />
                            })
                        }
                    </div>

                </div>

                <div className="h-full w-[80rem] bg-[#1D1D1D]"></div>

                <div className="h-full w-[20rem] border-l-[1px] border-[#808080]">
                    <div className="relative top-[5rem] w-full h-[40rem] flex flex-col justify-between">
                        <div className="w-full h-[20rem] flex flex-col justify-evenly items-center">
                            <div className="text-xl w-[50%]">
                                <h1>System</h1>

                                <select className="bg-[#1D1D1D] w-[70%] rounded-md text-[17px]" 
                                    onChange={(e) => {
                                        setSystem(e.target.value)
                                        system !== 'metric' ? setMesTypes({ large: ['m', 'kg'], small: ['cm', 'g'] }) : setMesTypes({ large: ['ft', 'lb'], small: ['in', 'oz'] })
                                    }}>

                                    <option value="metric">Metric</option>
                                    <option value="imperial">Imperial</option>
                                </select>
                            </div>

                            <div className="text-xl w-[50%]">
                                <h1>Gender</h1>

                                <select className="bg-[#1D1D1D] w-[70%] rounded-md text-[17px]">
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full h-[20rem] flex flex-col justify-evenly items-center">
                            <div className="text-xl w-[50%]">
                                <h1>Height</h1>

                                <div className="flex text-lg w-[80%] justify-between my-2">
                                    <label htmlFor="height1">{mesTypes.large[0]}</label>
                                    <input type="number" id="height1" className="bg-[#1D1D1D] w-[75%] rounded-md pl-2" />
                                </div>

                                <div className="flex text-lg w-[80%] justify-between">
                                    <label htmlFor="height2">{mesTypes.small[0]}</label>
                                    <input type="number" id="height2" className="bg-[#1D1D1D] w-[75%] rounded-md pl-2" />
                                </div>
                            </div>

                            <div className="text-xl w-[50%]">
                                <h1>Weight</h1>

                                <div className="flex text-lg w-[80%] justify-between my-2">
                                    <label htmlFor="weight1">{mesTypes.large[1]}</label>
                                    <input type="number" id="weight1" className="bg-[#1D1D1D] w-[75%] rounded-md pl-2" />
                                </div>

                                <div className="flex text-lg w-[80%] justify-between">
                                    <label htmlFor="weight2">{mesTypes.small[1]}</label>
                                    <input type="number" id="weight2" className="bg-[#1D1D1D] w-[75%] rounded-md pl-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function EditorBox({ data }: any) {
    return (
        <div className="editorBox mb-4">
            <p>{data}</p>
            <Image src={add} alt="add" />
        </div>
    )
}

export default DocEditor