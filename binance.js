const randomUseragent = require('random-useragent');
const fetch = require('node-fetch')

const get_leaderboard = async () => {
  const ranks_url = 'https://www.binance.com/bapi/futures/v3/public/future/leaderboard/getLeaderboardRank'
  const payload = { "isShared": true, "isTrader": false, "periodType": "WEEKLY", "statisticsType": "ROI", "tradeType": "PERPETUAL" }
  const response = await fetch(ranks_url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": randomUseragent.getRandom()
    }
  })
  const json = await response.json()
  return json.data
}

const get_trades = async (encryptedUid) => { // C1D1BA345CD3F3B26ECEEC3571E90BBD
  const profile_url = "https://www.binance.com/bapi/futures/v1/public/future/leaderboard/getOtherPosition"
  const payload = { "encryptedUid": encryptedUid, "tradeType": "PERPETUAL" }
  const response = await fetch(profile_url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": randomUseragent.getRandom()
    }
  })
  const json = await response.json()
  return json.data.otherPositionRetList
}

const get_user_info = async (encryptedUid) => {
  const profile_url = "https://www.binance.com/bapi/futures/v2/public/future/leaderboard/getOtherLeaderboardBaseInfo"
  const payload = { "encryptedUid": encryptedUid }
  const response = await fetch(profile_url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": randomUseragent.getRandom()
    }
  })
  const json = await response.json()
  return json.data
}

const get_encrypted_uid = async (nickname) => {
  const search_url = "https://www.binance.com/bapi/futures/v1/public/future/leaderboard/searchNickname"
  const payload = { "nickname": nickname }
  const response = await fetch(search_url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": randomUseragent.getRandom()
    }
  })
  const json = await response.json()
  return json['data'][0]
}


module.exports = { get_leaderboard, get_trades, get_user_info, get_encrypted_uid }