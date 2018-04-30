import Spilba from "./spilba";


const fromFileFactory = (board,file) => {
  return new Promise( (resolve,reject) => {
    let reader = new FileReader();
    reader.onload = event => {
      let Board = null;
      try {
        Board = new Spilba(reader.result);
        resolve(Board);
      } catch (ex) {
        resolve(ex);
      }
    };
    reader.readAsText(file);
  });
};

export {
  Spilba,
  fromFileFactory
};