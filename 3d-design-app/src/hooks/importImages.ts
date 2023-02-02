function useImages(directory: any) {
    let images = {} as any
    directory.keys().map((item: any, index: any) => {
        images[item.replace('./', '')] = directory(item)
    })

    return images
}

export default useImages