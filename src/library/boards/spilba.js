
/**
 *
 * Clase que interpreta los archivos de las placa Spilba
 *
 * @author Alejandro Cena alejandro.cena@gmail.com
 */
class Spilba {
    frecuency = 100;
    board = 'Spilba';
    version= 'v1';
    raw = null;
    columns = [];
    rows = [];

    constructor(data) {
        let lines = data.split('\n').filter(line => {
            return !(line.length === 0 || !line.trim())
        });

        this.raw = lines;
        this.columns = this._parseHeader(lines);
        this.rows = this._parseBody(lines);
    }

    _parseHeader(lines) {
        let headers = [];
        let flag = '[header]';
        let start = lines.map( (line,index) => {
            return line.indexOf(flag)===0 ? index : -1;
        }).filter( val => {return val > -1;})[0]+1;
        let end = lines.map( (line,index) => {
            return index > start && line.indexOf(']')>0 ? index : -1;
        }).filter(val => {return val > -1;})[0];
        for (let index = start; index < end; index++) {
            headers.push(lines[index].trim());
        }
        return headers;
    }

    _parseBody(lines) {
        let body = [];
        let flag = '[data]';
        let start = lines.map( (line,index) => {
            return line.indexOf(flag)===0 ? index : -1;
        }).filter( val => {return val > -1;})[0]+1;
        let end = lines.length;
        for (let index = start; index < end; index++) {
            body.push(lines[index].split(" "));
        }
        return body;
    }
}

export default Spilba;
