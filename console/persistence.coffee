
# this is a coffee script file

config = require('config')
sqlite3 = require('sqlite3').verbose()
murmurhash = require('murmurhash')
getmac = require('getmac')

class Persistence
    openCalled = false
    checkMasterSql = "select name from sqlite_master where type='table' and (name='KinisiMaster' or name='Storage');"
    createTablesSql = '''create table KinisiMaster (ts Date, mac Text, info Text, current Integer);
                         create table Persistence (cksum Integer, data Text);'''
    insertToMasterSql = 'insert into KinisiMaster values(?, ?, ?, ?);'
    self = this

    constructor: (cb) ->
        console.log config.SQLite.filename
        self.db = new sqlite3.Database config.SQLite.filename
        getmac.getMac((err, macAddress) ->
            if err
                cb err
                return
            self.mac = macAddress
            console.log self.mac
            self.db.get checkMasterSql, [], self.prototype.checkMaster(self.db, macAddress, cb))
    
    checkMaster: (db, mac, cb) ->
        (err, results) ->
            console.log 'enter post-check-master'
            if err
                cb 'could not check master record -> ' + err
                return
            
            console.log 'post-check-results'
            if !results || results.length < 2
                db.serialize( ->
                    db.run 'drop table if exists KinsiMaster; drop table if exists Storage;' #in weird corrupt state
                    db.run createTablesSql, [], (err, results) ->
                        console.log 'enter post-create-master'
                        if err
                            cb 'could not create master record -> ' + err
                        else
                            self.prototype.openStorage db, mac, cb
                )
            else
                self.prototype.openStorage db, mac, cb

    openStorage: (db, mac, cb) ->
        openCalled = true
        db.run insertToMasterSql, [new Date(), 'open', mac]
        cb null, 'storage opened'

    close: () ->
        openCalled = false
        db.run insertToMasterSql, [new Date(), 'close']

    write: (text, cb) ->
        throw new Error('not open') if !openCalled
        throw new Error('cannot store functions') if (typeof text == 'function')
        text = JSON.stringify(text) if (typeof text == 'object' or typeof test == 'number')
        cksum = murmurhash.v3(text)
        self.db.run 'insert into Persistence (?, ?)', [cksum, text], (err, results) ->
            if err
                cb 'error saving ' + text + ' -> ' + err
                return
            else
                cb null, cksum


testFunc = (err, results) ->
    console.log 'results:', results
    console.log 'error:', err

v = new Persistence (err, results) ->
    console.log 'start writing'
    v.write {ts:new Date(), lat: 40, lon: -70}, testFunc
    v.write 10, testFunc
    v.close()

#cksum = v.save("a string", (err, results) -> console.log results)
#console.log(cksum)

module.exports = Persistence
