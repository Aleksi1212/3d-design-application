function document({ params }: any) {
    return <h1 className="text-white">{params.docId}</h1>
}

export default document