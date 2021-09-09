import { setup } from "../startup.js"
setup.then(async (bot) => {
    var pagesweknowthereare = []

    await bot.continuedQuery({
        action: "query",
        list: "logevents",
        lelimit: "max",
        leuser: "ForestCryptid",
        leaction: "delete/delete"
    }).then((json) => {
        let pages = json[0].query.logevents.map((page) => page.title)
        pagesweknowthereare = pagesweknowthereare.concat(pages)
    }).catch()

    bot.batchOperation(pagesweknowthereare, (page) => {
        return bot.undelete(page).then(() => {
            return Promise.resolve()
        })
    })
})
