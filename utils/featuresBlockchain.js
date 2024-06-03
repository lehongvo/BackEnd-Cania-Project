const ethers = require('ethers');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

function formatTransaction(transactionData) {
    return {
        chainId: transactionData.chainId,
        hash: transactionData.hash,
        nonce: transactionData.nonce,
        blockHash: transactionData.blockHash,
        blockNumber: transactionData.blockNumber,
        transactionIndex: transactionData.transactionIndex,
        from: transactionData.from,
        to: transactionData.to,
        value: transactionData.value.toString(), // Convert value to string
        gasPrice: transactionData.gasPrice.toString(), // Convert gasPrice to string
        gas: transactionData.gas != undefined ? transactionData.gas.toString() : undefined,
        input: transactionData.data,
        v: transactionData.v,
        r: transactionData.r,
        s: transactionData.s,
        status: transactionData.status,
        contractAddress: transactionData.contractAddress,
        isError: transactionData.isError ? 'Error' : 'None'
    };
}

async function getAndFormatTransactionsFromBlock(blockNumber, provider) {
    try {
        const block = await provider.getBlockWithTransactions(blockNumber);
        const formattedTransactions = block.transactions.map(formatTransaction);
        return formattedTransactions;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

const saveTransactionsFromBlockToDB = async () => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_BLOCKCHAIN);
        const blockNumber = await provider.getBlockNumber() - 1;
        console.log(blockNumber);
        const formattedTransactions = await getAndFormatTransactionsFromBlock(blockNumber, provider);

        let transactionValue = [];
        await Promise.all(formattedTransactions.map(async transactionData => {
            transactionValue.push(transactionData);
        }));
        return transactionValue;
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    saveTransactionsFromBlockToDB
}