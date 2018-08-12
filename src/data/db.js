import PouchDB from 'pouchdb';
import Config from '../config';
import pouchdbDebug from 'pouchdb-debug';

/**
 * Pouch DB Debugger
 */
PouchDB.plugin(pouchdbDebug);
PouchDB.debug.enable('*');

const Tracks = new PouchDB(Config.get('DB_NAME')+'-tracks',{storage:'persistent'});
const Logs = new PouchDB(Config.get('DB_NAME')+'-logs',{storage:'persistent'});
const Sessions = new PouchDB(Config.get('DB_NAME')+'-sessions',{storage:'persistent'});
const Channels = new PouchDB(Config.get('DB_NAME')+'-channels',{storage:'persistent'});

export {
  Tracks,
  Logs,
  Sessions,
  Channels
};
