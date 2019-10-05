'use strict';

const db = require('./dbManager');

exports.connect = () => db.connect();
/*
exports.createEntry = db.createEntry(data);
exports.updateEntry = db.updateEntry(data);
exports.dropEntry = db.dropEntry(data);
*/