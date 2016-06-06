'use strict';
const expect = require('chai').expect;
const mongo = require('../index.js');

describe('simple tests', function() {
    let connect;
    //can connect
    before(function() {
        
        connect = mongo.getConnectPromise("mongodb://localhost:27017/dev");
    });
    
    it('can connect', done=>{
        connect.then(db=> done()).catch(done);
    });
    
    it('can insert', done=>{
        mongo.insertOne("unitTest",{key:"value"})
        .then(res=>{            
            expect(res.insertedCount).to.equal(1);
            done();
        })
        .catch(done);
    });
    
    it('can find', done=>{
        mongo.findOne("unitTest", {key: "value"})
        .then(doc => expect(doc.key).to.equal("value"))
        .then(()=> mongo.findOne("unitTest", {key: "notExisted"}))
        .then(doc => {
            console.log('no ok?', doc);
            expect(doc).to.not.be.ok;
        })
        .then(()=> mongo.findList("unitTest", {key: "value"}))
        .then(docs=> {
            expect(docs.length).to.equal(1);
            expect(docs[0].key).to.equal("value");
        })
        .then(()=> mongo.findList("unitTest", {key: "notExisted"}))
        .then(docs=> {
            console.log('hi');
            expect(docs.length).to.equal(0);
            done();
        })
        .catch(done);
    });
    
    it('can delete', done=>{
        mongo.deleteMany("unitTest", {key: "value"})
        .then(result=>{
            expect(result.deletedCount).to.equal(1);
            done();
        })
        .catch(done);
    });
    
    after(function() {
        mongo.close();
    });
    /* 
    
    it('can find', done=>{
        

    });
   */
});