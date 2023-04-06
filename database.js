const fs = require('fs');
const path = require('path');

async function check_file(user_id) {
  const filePath = path.join(__dirname, 'database', `${user_id}.json`);
  return fs.existsSync(filePath)
}

function create_file(user_id) {
  const filePath = path.join(__dirname, 'database', `${user_id}.json`);
  fs.writeFile(filePath, JSON.stringify({}), (err) => {
    if (err)
      console.log(err);
    else {
      console.log(`Created: ${user_id}.json`);
    }
  })
}

function get_following_list(user_id) {
  const filePath = path.join(__dirname, 'database', `${user_id}.json`);
  let following_list = fs.readFileSync(filePath)
  return following_list
}

function update_data_base(user_id, data) {
  const filePath = path.join(__dirname, 'database', `${user_id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data))
}

module.exports = { check_file, create_file, get_following_list, update_data_base }