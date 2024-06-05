const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        walletAddress: {
            type: String,
            required: [true, 'Wallet address is required'],
            unique: true, // Ensure walletAddress is unique
            validate: {
                validator: function (v) {
                    return /^(0x)?[0-9a-fA-F]{40}$/.test(v);
                },
                message: props => `${props.value} is not a valid wallet address!`
            }
        },
        toAddress: {
            type: String,
            required: [true, 'To address is required'],
            validate: {
                validator: function (v) {
                    return /^(0x)?[0-9a-fA-F]{40}$/.test(v);
                },
                message: props => `${props.value} is not a valid wallet address!`
            }
        },
        balance: {
            type: String,
            required: [true, 'Balance is required'],
            min: ["0", 'Balance must be non-negative']
        },
        nonce: {
            type: Number,
            required: [true, 'Nonce is required'],
            default: 0
        },
        chainId: {
            type: Number,
            required: [true, 'Chain ID is required'],
            min: [0, 'Chain ID must be non-negative']
        },
        timestamp: {
            type: Number,
            required: [true, 'Timestamp is required'],
            min: [0, 'Timestamp must be non-negative'],
            max: [2147483647, 'Timestamp must be less than or equal to 2147483647']
        },
        blockNumber: {
            type: Number,
            required: [true, 'Block number is required'],
            min: [0, 'Block number must be non-negative']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
