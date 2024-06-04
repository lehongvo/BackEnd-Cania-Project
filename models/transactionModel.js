const { ethers } = require('ethers');
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        hash: {
            type: String,
            required: [true, 'Transaction hash is required'],
            unique: true,
            validate: {
                validator: function (v) {
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a valid transaction hash!`
            },
            lowercase: true
        },
        type: {
            type: Number,
            required: [true, 'Transaction type is required'],
            enum: [0, 1, 2],
            default: 0
        },
        accessList: {
            type: [String],
            default: []
        },
        blockHash: {
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
        blockNumber: {
            type: Number,
            required: [true, 'Block number is required'],
            min: [0, 'Block number must be non-negative']
        },
        transactionIndex: {
            type: Number,
            required: [true, 'Transaction index is required'],
            min: [0, 'Transaction index must be non-negative']
        },
        confirmations: {
            type: Number,
            min: [0, 'Confirmations must be non-negative'],
            default: 0
        },
        from: {
            type: String,
            default: ethers.constants.AddressZero
        },
        gasPrice: {
            type: String,
            required: [true, 'Gas price is required']
        },
        gas: {
            type: String
        },
        to: {
            type: String,
            default: ethers.constants.AddressZero
        },
        value: {
            type: String,
            required: [true, 'Value is required'],
            min: [0, 'Value must be non-negative']
        },
        nonce: {
            type: Number,
            required: [true, 'Nonce is required'],
            min: [0, 'Nonce must be non-negative']
        },
        data: {
            type: String,
            required: [true, 'Data is required']
        },
        r: {
            type: String,
            default: '0x' + '0'.repeat(64),
            validate: {
                validator: function (v) {
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a valid R value!`
            }
        },
        s: {
            type: String,
            default: '0x' + '0'.repeat(64),
            validate: {
                validator: function (v) {
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a valid S value!`
            }
        },
        v: {
            type: Number,
            default: 0,
            min: [0, 'V value must be non-negative'],
            max: [25500000000000, 'V value must be less than or equal to 25500000000000']
        },
        creates: {
            type: String,
            default: null
        },
        chainId: {
            type: Number,
            min: [0, 'Chain ID must be non-negative']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);

transactionSchema.pre('save', async function (next) {
    const existingData = await this.model('Transaction').findOne({
        nonce: this.nonce,
        from: this.from,
        chainId: this.chainId,
        v: this.v,
        r: this.r,
        s: this.s
    });

    if (existingData) {
        return next(new Error('Data with same nonce, from, and chainId already exists'));
    }

    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
