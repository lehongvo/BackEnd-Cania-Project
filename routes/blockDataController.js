const factory = require('./handlerFactory');
const catchAsync = require('./utils/catchAsync');
const BlockData = require('../models/blockNumberModel');

exports.getAllBlockData = factory.getAll(BlockData);

exports.createBlockData = factory.createOne(BlockData);

exports.getOneBlockData = factory.getOne(BlockData, 'BlockData');

exports.updateBlockData = factory.updateOne(BlockData);

exports.deleteBlockData = factory.deleteOne(BlockData);