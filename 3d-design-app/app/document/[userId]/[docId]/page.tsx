import DocEditor from "../../../../src/components/designing/editor"


async function Editor({ params }: any) {
    const docCredentials = params.docId.split('%3D')

    const docs: any = {
        user: params.userId,
        docId: docCredentials[0],
        docName: docCredentials[1]
    }

    return (
        <DocEditor designData={docs} />
    )
}

export default Editor