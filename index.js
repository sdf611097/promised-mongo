'use strict'
const mongodb = require('mongodb');

let MongoClient = mongodb.MongoClient;
let connectPromise;

function connect(url, options) {
    if(!options) {
        options = {};
    }
    return new Promise((resolve, reject)=> {
        MongoClient.connect(url, options, function(err, db){
            if(err) reject(err);
            else resolve(db);
        });
    });
}

function getConnectPromise(url, options) {
    connectPromise = connect(url, options);
    return connectPromise;
}

function close() {
    connectPromise.then(db=> db.close());
}

function findList(collectionName, query) {
    return connectPromise
    .then(db=>{
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find(query).toArray(function(err, docs) {
                if(err) reject(err);
                else resolve(docs);
            });
        });
    });
}

function insertOne(collectionName, data) {
    return connectPromise
    .then(db=>{
        return new Promise((resolve, reject) => {
            db.collection(collectionName).insertOne(data, function(err, res) {
                if(err) reject(err);
                else resolve(res);
            });
        });
    });
}

function insertMany(collectionName, data) {
    return connectPromise
    .then(db=>{
        return new Promise((resolve, reject) => {            
            if(data && data.length>=1){
                db.collection(collectionName).insertMany(data, function(err, res) {
                    
                    if(err) reject(err);
                    else {
                        if(res && res.insertedCount==data.length){
                            resolve(res);
                        }else{
                            //this case not been tested, mongo seems can insert different type to same field
                            reject(new Error("Only "+res.insertedCount+" inserted from " +data.length));
                        }
                    }
                });
            }else{
                reject(new Error('input is not an array'));
            }
        });
    });
}

function findOne(collectionName, query) {
    return connectPromise
    .then(db=>{
        return new Promise((resolve, reject) => {
            db.collection(collectionName).findOne(query, function(err, doc) {
                if(err) reject(err);
                else resolve(doc);
            });
        });
    });
}

function deleteMany(collectionName, filter, options) {
    if(!options) {
        options = {};
    }
    return connectPromise
    .then(db=> {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).deleteMany(filter, options, function(err, result) {
                if(err) reject(err);
                else resolve(result);
            });
        });
    });
}

exports.getConnectPromise = getConnectPromise;
exports.close = close;
exports.insertOne = insertOne;
exports.insertMany = insertMany;
exports.findOne = findOne;
exports.findList = findList;
exports.deleteMany = deleteMany;
