
function importImages(directory: any) {
    let images = {} as any
    directory.keys().map((item: any, index: any) => {
        images[item.replace('./', '')] = directory(item)
    })

    return images
}

const importAll = importImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))

const images = {
    acceptRequest: importAll['acceptRequest.png'],
    add: importAll['add.png'], 
    addDesign: importAll['addDesignToMessage.png'],
    addDoc: importAll['addDoc.png'],
    addFriend: importAll['addFriend.png'],
    addImage: importAll['addImageToMessage.png'],
    addProfileImage: importAll['addProfileImage.png'],
    appLogo: importAll['appLogo.png'],
    arrow1: importAll['arrow1.svg'],
    arrow2: importAll['arrow2.svg'], 
    arrow3: importAll['arrow3.svg'],
    arrowDown: importAll['arrowDown.png'],

    back: importAll['back.png'],
    block: importAll['block.png'],

    check: importAll['check.png'],
    close: importAll['close.png'],
    closeError: importAll['closeError.png'],
    cross: importAll['cross.svg'],

    dashboard: importAll['dashboard.png'],
    docMenu: importAll['docMenu.png'],
    docRemove: importAll['docRemove.png'],
    docShare: importAll['docShare.png'],

    email: importAll['email.png'],
    error: importAll['error.png'],
    expand: importAll['expand.png'],

    facebook: importAll['facebook.png'],
    friendNoti: importAll['friendNoti.png'],

    github: importAll['github.png'],
    google: importAll['google.png'],

    happy1: importAll['happy1.png'],
    happy2: importAll['happy2.png'],
    hide: importAll['hide.png'],
    home: importAll['home.png'],

    lockProfile: importAll['lockProfile.png'],
    logo: importAll['logo.png'],
    logIn: importAll['logIn.png'],

    message: importAll['message.png'],
    search: importAll['search.png'],
    settings: importAll['settings.png'],
    show: importAll['show.png'],
    showSearch: importAll['showSearch.png'],
    signOut: importAll['signOut.png'],
    success: importAll['success.png'],

    unfriend: importAll['unfriend.png'],
    unlockProfile: importAll['unlockProfile.png'],
    userMenu: importAll['userMenu.png'],
    userProfile: importAll['userProfile.png']
}

export default images