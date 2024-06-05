
const Transaction = require('../models/transactionModel');
const BlockData = require('../models/blockNumberModel');
const { networkData, saveTransactionsFromBlockToDB } = require('../utils/featuresBlockchain');
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
        blockData = blockData.filter(block => block !== null);

        if (blockData.length > 0) {
            const insertPromises = blockData.map(async (tx) => {
                try {
                    await Transaction.updateOne(
                        { hash: tx.hash },
                        { $setOnInsert: tx },
                        { upsert: true }
                    );
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