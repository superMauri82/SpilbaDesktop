import {Channels} from './db';

//Logs.info().then(console.log).catch(console.log);

export default {
  
  getAll: () => Channels.allDocs({include_docs:true}).then((resp) => { return resp.rows.map(row => row.doc).filter( lg => !lg._deleted )}),
  
  create: (chn) => Channels.post(chn),

  createMany: (log) => Channels.bulkDocs(log.data.columns.map(ch => ({ _id: ch, name: ch, function: 'Data Adquirida', active: false, zoom: {}, triggeredZoom: false }) )).catch(console.log),

  toggleActive: (chn) => Channels.get(chn._id).then(function(doc) {
    return Channels.put({
      _id: chn._id,
      _rev: doc._rev,
      name: chn.name,
      function: chn.function,
      active: !chn.active,
      zoom: {}
    });
  }).then(function(response) {
    return response
  }).catch(function (err) {
    console.log(err);
  }), 

  delete: (chn) => Channels.get(chn._id).then( doc => Channels.remove(doc) ).catch( err => console.log(err))
 
};

