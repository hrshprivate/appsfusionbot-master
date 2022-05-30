function formMessage({app, title, rating}){ 
    return `*${app?.title || title}*
    ${rating}
    ${app.text}\n
    _${app?.version || ""}_ ${app?.date?.split("T")[0] || ""}
    _${app.userName}_`
}

function formMessageGS({app, title, rating}){
    return `*${app?.title || title}*
    ${rating}
    ${app.text}\n
    _${app?.version || ""}_ ${app?.date?.toISOString().split[0] || ""}
    _${app.userName}_`
}

function formMessageForSearch(user, ctx){
    let store
        switch(user.settings.store){
            case "APP_STORE":
                store = "appstore"
                break
            case "GOOGLE_PLAY":
                store = "googleplay"
                break
            default:
                store = "appstore and googleplay"
                break
        }
    const message = ctx.i18n.t('searchFirstPart', { country: user.settings.country}) 
    + '\n' 
    + ctx.i18n.t('searchSecondPart', { store })
    return message
}

module.exports = {
    formMessage,
    formMessageForSearch,
    formMessageGS
} 