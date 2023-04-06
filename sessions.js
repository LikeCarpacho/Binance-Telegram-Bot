let actives_sessions = []

const addSession = (userId) => {
  actives_sessions.push(userId)
}

const stopSession = (userId) => {
  const index = actives_sessions.indexOf(userId)
  actives_sessions.splice(index, 1)
}

const hasActiveSession = (userId) => {
  return actives_sessions.includes(userId)
}

module.exports = { addSession, stopSession, hasActiveSession }