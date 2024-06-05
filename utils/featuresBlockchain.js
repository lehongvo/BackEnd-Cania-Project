const ethers = require('ethers');
const dotenv = require('dotenv');
dotenv.config()


const formatTransaction = (transactionData) => {
    const ethValue = ethers.utils.formatEther(transactionData.value);

    if (Number(transactionData.value) <= 0) {
        return null;
    }

    return {
        chainId: transactionData.chainId,
        hash: transactionData.hash,
        nonce: transactionData.nonce,
        blockHash: transactionData.blockHash,
        blockNumber: transactionData.blockNumber,
        transactionIndex: transactionData.transactionIndex,
        from: transactionData.from,
        to: transactionData.to,
        value: Number(transactionData.value), // Convert value to string
        gasPrice: transactionData.gasPrice.toString(), // Convert gasPrice to string
        gas: transactionData.gas != undefined ? transactionData.gas.toString() : undefined,
        data: transactionData.data,
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

const saveTransactionsFromBlockToDB = async (oldBlockNumber, latestBlockNumber) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_BLOCKCHAIN);

        const promises = Array.from(
            { length: latestBlockNumber - oldBlockNumber },
            (_, i) => getAndFormatTransactionsFromBlock(oldBlockNumber + i, provider)
        );

        const results = await Promise.all(promises);
        const transactionValue = results.flat();
        const blockData = transactionValue.filter(block => block !== null);
        return blockData;
    } catch (error) {
        console.error('Error:', error);
    }
}

const networkData = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_BLOCKCHAIN);
    const blockNumber = Number(await provider.getBlockNumber()) - 10;
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const block = await provider.getBlockWithTransactions(blockNumber);
    return {
        chainId,
        timestamp: block.timestamp,
        difficulty: block.difficulty,
        blockNumber,
        parentHash: block.parentHash,
        gasLimit: Number(block.gasLimit),
        gasUsed: Number(block.gasUsed),
        miner: block.miner,
        baseFeePerGas: block.baseFeePerGas.toString(),
        extraData: block.extraData.toString(),
        nonce: block.nonce.toString(),
        totalTransaction: block.transactions.length,
    };
}

const getBalanceWalletAddressToEth = async (walletAddress) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_BLOCKCHAIN);
    const balance = await provider.getBalance(walletAddress);
    return ethers.utils.formatEther(balance);
}

const getSymbolNetwork = (chainId) => {
    switch (chainId) {
        case 1:
            return 'ETH';
        case 11155111:
            return 'Sepolia';
        case 80002:
            return 'AMOY';
        case 137:
            return 'MATIC';
        default:
            return 'Unknown';
    }
}

module.exports = {
    networkData,
    saveTransactionsFromBlockToDB,
    getBalanceWalletAddressToEth,
    getSymbolNetwork,
}