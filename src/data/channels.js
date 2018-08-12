import {Channels} from './db';

//Logs.info().then(console.log).catch(console.log);

export default {
  
  getAll: () => Channels.allDocs({include_docs:true}).then((resp) => { return resp.rows.map(row => row.doc).filter( lg => !lg._deleted )}),
  
  create: (chn) => Channels.post(chn),

  delete: (chn) => Channels.get(chn._id).then( doc => Channels.remove(doc) ).catch( err => console.log(err))
 
};

