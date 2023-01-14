'use client';

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
// import { Item, Props } from '../datalayer/read';

function Test(props: any) {
    // const [items, setItems] = useState(data)

    // useEffect(() => {
    //     setItems(data)
    // }, [data])
    const router = useRouter()
    const data = router.query

    return (
        <h1 className="text-white">{JSON.stringify(data)}</h1>
        // <div>
        //     {items.map((item) => (
        //         <div className="text-white">
        //             <h1>{item.id}</h1>
        //         </div>
        //     ))}
        // </div>
    ) 
}

export default Test