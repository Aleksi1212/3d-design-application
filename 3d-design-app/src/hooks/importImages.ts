
function useImages(directory: any) {
    let images = {} as any
    directory.keys().map((item: any, index: any) => {
        images[item.replace('./', '')] = directory(item)
    })

    return images
}

const importAll = useImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))

const images = {
    add: importAll['add.png'], 
    addDoc: importAll['addDoc.png'],
    addFriend: importAll['addFriend.png'], 
    arrow1: importAll['arrow1.svg'],
    arrow2: importAll['arrow2.svg'], 
    arrow3: importAll['arrow3.png'],
    arrowDown: importAll['arrowDown.png'],
    back: importAll['back.png'],
    block: importAll['block.png'],
    check: importAll['check.png'],
    close: importAll['close.png'],
    cross: importAll['cross.svg'],
    docMenu: importAll['docMenu.png'],
    docRemove: importAll['docRemove.png'],
    docShare: importAll['docShare.png'],
    editProfile: importAll['editProfile.png'],
    email: importAll['email.png'],
    expand: importAll['expand.png'],
    faecbook: importAll['facebook.png'],
    github: importAll['github.png'],
    google: importAll['google.png'],
    hide: importAll['hide.png'],
    home: importAll['home.png'],
    lockProfile: importAll['lockProfile.png'],
    logo: importAll['logo.png'],
    message: importAll['message.png'],
    search: importAll['search.png'],
    show: importAll['show.png'],
    showSearch: importAll['showSearch.png'],
    signOut: importAll['signOut.png'],
    unfriend: importAll['unfriend.png'],
    unlockProfile: importAll['unlockProfile.png'],
    userMenu: importAll['userMenu.png'],
    userProfile: importAll['userProfile.png']
}

export default images