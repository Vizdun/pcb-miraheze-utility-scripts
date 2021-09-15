import { setup } from "../startup.js"
setup.then(async (bot) => {
  var comments = []

  await bot.getCsrfToken()

  for await (let json of bot.continuedQueryGen({
    action: "query",
    list: "logevents",
    leaction: "comments/add",
    lelimit: "max",
  })) {
    comments = comments.concat(json.query.logevents)
  }

  await bot.getCsrfToken()

  bot.batchOperation(comments, (comment) => {
    if (comment.anon == true) {
      return bot.query({
        action: "commentdelete",
        commentID: comment.params.commentid,
        token: bot.csrfToken.toString(),
      })
    }
    return Promise.resolve()
  })
})
