const {Map} = require('immutable');

const Config = Map()
  .set('Profiles', [
    {id: 1, name: 'user1'},
    {id: 2, name: 'user2'}
  ])
  .set('Boards', [
    {id: 1, name: 'spilba'}
  ])
  .set('DB_NAME','atk-tools');

module.exports = {
  get: (key) => {
    return Config.get(key);
  }
};
