import { strict } from "assert";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

// interface Item {
//     id: string
//     data: object
// }

// interface Props {
//     data: Item[]
// }


async function Get(): Promise<any> {
    const querySnapshots = await getDocs(collection(db, 'data'))
    const data = querySnapshots.docs.map((doc) => doc.data())

    return data
}

export default Get