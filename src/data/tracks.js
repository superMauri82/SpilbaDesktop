import {Tracks} from './db';

Tracks.info().then(console.log).catch(console.log);

export default {
  
  getAll: () => Tracks.allDocs({include_docs:true}).then((resp) => { return resp.rows.map(row => row.doc)}),
  
  create: (track) => Tracks.post(track)
  
};