
const Transaction = require('../models/transactionModel');
const BlockData = require('../models/blockNumberModel');
const User = require('../models/userModels');

const {
    networkData,
    saveTransactionsFromBlockToDB,
    getBalanceWalletAddressToEth,
    getSymbolNetwork
} = require('../utils/featuresBlockchain');
const { default: nodemon } = require('nodemon');

const IScanData = async (req, res) => {
    try {
        const newBlockData = await networkData();
        const existingData = await BlockData.findOne({
            chainId: newBlockData.chainId
        })

        newBlockData.blockNumber -= 10;

        const oldBlock = existingData ? existingData.blockNumber : newBlockData.blockNumber;

        if (existingData) {
            if (Number(newBlockData.blockNumber) > Number(existingData.blockNumber)) {
                await BlockData.findOneAndUpdate(
                    { chainId: newBlockData.chainId },
                    { $set: newBlockData },
                    { new: true }
                );
            }
        } else {
            await BlockData.create(newBlockData);
        }

        let blockData = await saveTransactionsFromBlockToDB(
            Number(oldBlock), Number(newBlockData.blockNumber)
        );

        if (blockData.length > 0) {
            const insertPromises = blockData.map(async (tx) => {
                try {
                    const balance = await getBalanceWalletAddressToEth(tx.from);
                    const symbol = getSymbolNetwork(newBlockData.chainId);
                    if (parseInt(balance) > 0.01) {
                        await Transaction.updateOne(
                            { hash: tx.hash },
                            { $setOnInsert: tx },
                            { upsert: true }
                        );

                        await User.findOneAndUpdate(
                            { walletAddress: tx.from },
                            {
                                $set: {
                                    walletAddress: tx.from,
                                    toAddress: tx.to,
                                    balance: `${balance} ${symbol}`,
                                    nonce: tx.nonce,
                                    chainId: newBlockData.chainId,
                                    timestamp: newBlockData.timestamp,
                                    blockNumber: newBlockData.blockNumber
                                }
                            },
                            { upsert: true }
                        );
                    }
                } catch (error) {
                    console.error(`Error inserting transaction with hash ${tx.hash}:`, error);
                    res.status(500).json({
                        status: 'error',
                        message: 'An error occurred while adding transactions to the database',
                        error: error.message
                    });
                }
            });

            await Promise.all(insertPromises);

            res.status(200).json({
                status: 'success',
                count: blockData.length,
                message: 'Transactions added successfully',
                data: {
                    transactions: blockData
                }
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Empty Data'
        });
    } catch (error) {
        console.error('Error adding transactions to database:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while adding transactions to the database',
            error: error.message
        });
    }
}

module.exports = IScanData;