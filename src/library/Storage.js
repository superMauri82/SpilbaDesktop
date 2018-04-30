const assert = require('assert');

export default class LocalStorage {

    set(key, value) {
        assert.ok(typeof key == 'string');
        assert.ok(typeof value == 'string');
        localStorage.setItem(key,value);
    }

    get(key) {
        assert.ok(typeof key == 'string');
        return localStorage.getItem(key);
    }

    has(key){
        assert.ok(typeof key == 'string');
        return localStorage.getItem(key) !== null
    }

    remove(key) {
        assert.ok(typeof key == 'string');
        localStorage.removeItem(key);
    }

    count(){
        return localStorage.length;
    }

    keys(){
        const keys = [];
        for (let i = 0; i < localStorage.length; ++i) {
            keys.push(localStorage.key(i));
        }
        return keys;
    }

    getUsedSpace(){
        let sum = 0

        for (let i = 0; i < localStorage.length; ++i) {
            let key = localStorage.key(i)
            let value = localStorage.getItem(key)
            sum += key.length + value.length
        }

        return sum
    }

    getItemUsedSpace(key) {
        const value = localStorage.getItem(key)
        if (value === null) {
            return NaN
        } else {
            return key.length + value.length
        }
    }

    consoleInfo(fShowMaximumSize = false) {
        let amount = 0
        let size = 0

        for (let i = 0; i < localStorage.length; ++i) {
            let key = localStorage.key(i)
            let value = localStorage.getItem(key);
            console.log(amount, key, value)
            size += key.length + value.length
            amount++
        }
        console.log("Total entries:", amount);
        console.log("Total size:", size);
    }

    getRemainingSpace(){
        let itemBackup = localStorage.getItem("")
        let increase = true
        let data = "1"
        let totalData = ""
        let trytotalData = ""
        while (true) {
            try {
                trytotalData = totalData + data
                localStorage.setItem("", trytotalData);
                totalData = trytotalData;
                if (increase) data += data
            } catch (e) {
                if (data.length < 2) {
                    break;
                }
                increase = false
                data = data.substr(data.length / 2)
            }
        }
        if (itemBackup === null) localStorage.removeItem("")
        else localStorage.setItem("", itemBackup)

        return totalData.length
    }
}