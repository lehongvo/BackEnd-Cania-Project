const { ethers } = require('ethers');
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
            min: [0, 'Difficulty must be non-negative'],

        },
        parentHash: {
            type: String,
            required: [true, 'Block hash is required'],
            validate: {
                validator: function (v) {
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a valid block hash!`
            },
            lowercase: true
        },
        gasLimit: {
            type: Number,
            required: [true, 'Gas limit is required'],
            min: [0, 'Gas limit must be non-negative']
        },
        gasUsed: {
            type: Number,
            required: [true, 'Gas used is required'],
            min: [0, 'Gas used must be non-negative']
        },
        miner: {
            type: String,
            default: ethers.constants.AddressZero
        },
        baseFeePerGas: {
            type: Number,
            required: [true, 'Base fee per gas is required']
        },
        extraData: {
            type: String,
            required: [true, 'Extra data is required']
        },
        nonce: {
            type: String,
            default: '00000000-0000-0000-0000-000000000000'
        },
        totalTransaction: {
            type: Number,
            required: [true, 'Total transaction is required'],
            min: [0, 'Total transaction must be non-negative'],
            max: [2147483647, 'Total transaction must be less than or equal to 2147483647']
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