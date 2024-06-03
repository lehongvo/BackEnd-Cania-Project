const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        hash: {
            type: String,
            required: [true, 'Transaction hash is required'],
            unique: true,
            validate: {
                validator: function (v) {
                    // Validate Ethereum address format
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a valid transaction hash!`
            }
        },
        type: {
            type: Number,
            required: [true, 'Transaction type is required'],
            enum: [0, 1, 2], // Specify valid transaction types
            default: 0 // Default to 0 if not provided
        },
        accessList: {
            type: [String], // Assuming accessList is an array of strings
            default: [] // Default to empty array if not provided
        },
        blockHash: {
            type: String,
            required: [true, 'Block hash is required'],
            validate: {
                validator: function (v) {
                    // Validate Ethereum address format
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a valid blockHash!`
            }
        },
        blockNumber: {
            type: Number,
            required: [true, 'Block number is required'],
            min: [0, 'Block number must be non-negative'] // Ensure block number is non-negative
        },
        transactionIndex: {
            type: Number,
            required: [true, 'Transaction index is required'],
            min: [0, 'Transaction index must be non-negative'] // Ensure transaction index is non-negative
        },
        confirmations: {
            type: Number,
            required: [true, 'Confirmations is required'],
            min: [0, 'Confirmations must be non-negative'] // Ensure confirmations are non-negative
        },
        from: {
            type: String,
            required: [true, 'From address is required'],
            validate: {
                validator: function (v) {
                    // Validate Ethereum address format
                    return /^(0x)?[0-9a-fA-F]{40}$/.test(v);
                },
                message: props => `${props.value} is not a valid Ethereum address!`
            }
        },
        gasPrice: {
            type: String,
            required: [true, 'Gas price is required']
        },
        gas: {
            type: String,
            required: [true, 'Gas limit is required'],
            default: undefined // Default to undefined if not provided
        },
        to: {
            type: String,
            required: [true, 'To address is required'],
            validate: {
                validator: function (v) {
                    // Validate Ethereum address format
                    return /^(0x)?[0-9a-fA-F]{40}$/.test(v);
                },
                message: props => `${props.value} is not a valid Ethereum address!`
            }
        },
        value: {
            type: String,
            required: [true, 'Value is required'],
            min: [0, 'Value must be non-negative'] // Ensure value is non-negative
        },
        nonce: {
            type: Number,
            required: [true, 'Nonce is required'],
            min: [0, 'Nonce must be non-negative'] // Ensure nonce is non-negative
        },
        data: {
            type: String,
            required: [true, 'Data is required']
        },
        r: {
            type: String,
            required: [true, 'R value is required'],
            default: '0x' + '0'.repeat(64), // Default value for r
            unique: true,
            validate: {
                validator: function (v) {
                    // Validate Ethereum address format
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a R value!`
            }
        },
        s: {
            type: String,
            required: [true, 'S value is required'],
            default: '0x' + '0'.repeat(64), // Default value for s
            unique: true,
            validate: {
                validator: function (v) {
                    // Validate Ethereum address format
                    return /^(0x)?[0-9a-fA-F]{64}$/.test(v);
                },
                message: props => `${props.value} is not a S value!`
            }
        },
        v: {
            type: Number,
            required: [true, 'V value is required'],
            default: 0x1b, // Default value for v
            unique: true,
            min: [0, 'V value must be non-negative'], // Ensure v is non-negative
            max: [25500000000000, 'V value must be less than or equal to 25500000000000']
        },
        creates: {
            type: String,
            default: null, // Default to null if not provided
            validate: {
                validator: function (v) {
                    // Validate Ethereum address format if provided
                    return !v || /^(0x)?[0-9a-fA-F]{40}$/.test(v);
                },
                message: props => `${props.value} is not a valid Ethereum address!`
            }
        },
        chainId: {
            type: Number,
            required: [true, 'Chain ID is required'],
            min: [0, 'Chain ID must be non-negative'] // Ensure chain ID is non-negative
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        // timestamps: true // Automatically manage createdAt and updatedAt fields
    }
);

// Add a pre-save middleware to check if the transaction data already exists before saving
// This is necessary because the combination of nonce, from, and chainId is unique
transactionSchema.pre('save', async function (next) {
    // Query the database for transactions with the same nonce, from, and chainId
    const existingData = await this.model('Transaction').findOne({
        nonce: this.nonce,
        from: this.from,
        chainId: this.chainId
    });

    // If a transaction with the same data already exists, throw an error
    if (existingData) {
        return next(new Error('Data with same nonce, from, and chainId already exists'));
    }

    // If the transaction data is unique, proceed with the save operation
    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
