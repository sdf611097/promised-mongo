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
    connectPromise.then(db=> db.close);
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
exports.findOne = findOne;
exports.findList = findList;
exports.deleteMany = deleteMany;
