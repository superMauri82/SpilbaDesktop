import {Logs} from './db';

//Logs.info().then(console.log).catch(console.log);

export default {
  
  getAll: () => Logs.allDocs({include_docs:true}).then((resp) => { return resp.rows.map(row => row.doc).filter( lg => !lg._deleted )}),
  
  create: (log) => Logs.post({...log, active:true}),

  delete: (log) => Logs.get(log._id).then( doc => Logs.remove(doc) ).catch( err => console.log(err))
 
};

