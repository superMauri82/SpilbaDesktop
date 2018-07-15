import {Logs} from './db';

//Logs.info().then(console.log).catch(console.log);

export default {
  
  getAll: () => Logs.allDocs({include_docs:true}).then((resp) => { return resp.rows.map(row => row.doc)}),
  
  create: (log) => Logs.post(log)
  
};

