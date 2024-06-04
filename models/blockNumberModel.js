const mongoose = require('mongoose');

const blockNumberSchema = new mongoose.Schema(
    {
        blockNumber: {
            type: String,
            required: [true, 'Block number is required']
        },
        chainId: {
            type: Number,
            required: [true, 'Chain ID is required'],
            min: [0, 'Chain ID must be non-negative'],
            unique: true,
        },
        timestamp: {
            type: Number,
            required: [true, 'Timestamp is required'],
            min: [0, 'Timestamp must be non-negative'],
            max: [2147483647, 'Timestamp must be less than or equal to 2147483647']
        },
        difficulty: {
            type: Number,
            required: [true, 'Difficulty is required'],
            min: [0, 'Difficulty must be non-negative']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);

const BlockData = mongoose.model('BlockData', blockNumberSchema);

module.exports = BlockData;