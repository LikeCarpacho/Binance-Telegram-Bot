
const { check_file, create_file, get_following_list, update_data_base } = require('../database')
const { get_encrypted_uid, get_user_info } = require('../binance')

module.exports = async ctx => {
  const user_id = ctx.from.id
  const arg = ctx.message.text.split(' ')[1];

  if (!arg) {
    await ctx.reply('/follow { user-name }')
    return
  }

  if (await check_file(user_id) == false) {
    create_file(user_id)
  }

  const encryptedUid = await get_encrypted_uid(arg)
  let user_info

  try {
    user_info = await get_user_info(encryptedUid.encryptedUid)
  } catch (err) {
    ctx.reply("This user doesn't exist")
    return
  }

  let file = get_following_list(user_id)
  let data = JSON.parse(file)
  
  !data[user_id] ? data[user_id] = [] : null

  for (i of data[user_id]) {
    if (i['nickName'] === user_info.nickName) {
      await ctx.reply('You are allready following this user.')
      return
    }
  }

  data[user_id].push({ nickName: user_info.nickName, encryptedUid: encryptedUid.encryptedUid })
  update_data_base(user_id, data)
  await ctx.reply(`✅ You are now tracking ${user_info.nickName} ( ${user_info.followerCount} Followers )`)
  user_info.userPhotoUrl !== "" ? await ctx.replyWithPhoto(user_info.userPhotoUrl) : null

}