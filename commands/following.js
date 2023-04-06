const { check_file, get_following_list } = require('../database')

module.exports = async ctx => {
  
  const user_id = ctx.from.id
  const haveFollowingList = await check_file(user_id)

  if (!haveFollowingList) {
    ctx.reply("You aren't following anyone")
    return
  }
  
  let file = get_following_list(user_id)
  let data = JSON.parse(file)
  let following_list = data[user_id]

  if (following_list.lenght == 0) {
    ctx.reply("You aren't following anyone")
    return
  }

  let traders_buttons = []

  for (let user of following_list) {
    traders_buttons.push([{ text: `${user['nickName']}`, callback_data: `get_trades#${user['encryptedUid']}` }])
  }
  
  ctx.reply('> Following List <', {
    reply_markup: {
      inline_keyboard: traders_buttons
    }
  });

}