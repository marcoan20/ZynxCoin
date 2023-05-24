import { Block, Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
const PORT = 4000;
const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const CRYPTO_VALUE = 0.0001;

app.get('/blocks', async (req, res) => {
    const blocks = await prisma.block.findMany({orderBy: {index: 'asc'}});
    if(blocks.length === 0){
        const index = 0;
        const timestamp = new Date().toISOString();
        const previousHash = '0';
        const value = 0;
        const hash = await bcrypt.hash(`${index}${timestamp}${value}${previousHash}`, 10);
        await prisma.block.create({data: {index: 0, timestamp: new Date().toISOString(), value, previousHash, hash}});
    }
    res.json(blocks);
});

app.post('/users', async (req, res) => {
    try{
        const {cpf_cnpj, name} = req.body;
        const user = await prisma.user.create({data: {cpf_cnpj, name}});
        res.json(user);
    }catch(error){
        res.json({message: 'An error ocurred', error: error.message});
    }
});

app.get('/users/:id', async (req, res) => {
    try{
        const user = await prisma.user.findUnique({where: {cpf_cnpj: req.params.id}, include: {blocksReceived: true, blocksSended: true}});
        if(!user) return res.json({message: 'User not found'});
        const receivedCryptos = user.blocksReceived.reduce((acc, block) => acc + Number(block.value), 0);
        const sendedCryptos = user.blocksSended.reduce((acc, block) => acc + Number(block.value), 0);
        res.json({user, balance: receivedCryptos - sendedCryptos});
    }catch(error){
        res.json({message: 'An error ocurred', error: error.message});
    }
});

app.get('/blocks/mine/:user', async (req, res) => {
    try{
        let blocks = await prisma.block.findMany({orderBy: {index: 'asc'}});
        const {multiplier} = req.query;
        if(blocks.length === 0){
            const index = 0;
            const timestamp = new Date().toISOString();
            const previousHash = '0';
            const value = 0;
            const hash = await bcrypt.hash(`${index}${timestamp}${value}${previousHash}`, 10);
            await prisma.block.create({data: {index: 0, timestamp: new Date().toISOString(), value, previousHash, hash}});
        }
        blocks = await prisma.block.findMany({orderBy: {index: 'asc'}});
        const value = multiplier ? CRYPTO_VALUE * Number(multiplier) : CRYPTO_VALUE;
        const previousBlock = blocks[blocks.length - 1];
        const index = blocks.length;
        const timestamp = new Date().toISOString();
        const previousHash = previousBlock.hash;
        const hash = await bcrypt.hash(`${index}${timestamp}${value}${null}${req.params.user}${previousHash}`, 10);
        await prisma.block.create({data: {index, timestamp, value, receiver: req.params.user, previousHash, hash}});
        res.json({message: 'Successfully mined', value, price: CRYPTO_VALUE });
    }catch(error){
        res.json({message: 'An error ocurred', error: error.message});
    }
});

// make a route to validate the blockchain
app.get('/blocks/validate', async (req, res) => {
    try{
        let blocks = (await prisma.block.findMany({orderBy: {index: 'asc'}}));
        if(blocks.length === 0){
            const index = 0;
            const timestamp = new Date().toISOString();
            const previousHash = '0';
            const value = 0;
            const hash = await bcrypt.hash(`${index}${timestamp}${value}${previousHash}`, 10);
            await prisma.block.create({data: {index: 0, timestamp: new Date().toISOString(), value, previousHash, hash}});
            blocks = await prisma.block.findMany({orderBy: {index: 'asc'}});
        }
        let invalidBlocks: Block[] = [];
        const isValid = blocks.every((block, index) => {
            if(index === 0) return true;
            const previousBlock = blocks[index - 1];
            console.log(previousBlock, null)
            console.log(`${block.index}${block.timestamp}${block.value}${block.sender}${block.receiver}${previousBlock.hash}`);
            const isValid = bcrypt.compareSync(`${block.index}${block.timestamp}${block.value}${block.sender}${block.receiver}${previousBlock.hash}`, block.hash);
            console.log(isValid);
            if(!isValid) invalidBlocks.push(block);
            return isValid;
        });
        if(isValid) return res.json({message: 'Blockchain is valid', invalidBlocks});
        return res.status(417).json({message: 'Blockchain is invalid', invalidBlocks});
    }catch(error){
        res.json({message: 'An error ocurred', error: error.message});
    }
});

app.post('/transaction', async (req, res) => {
    try{
        const {data} = req.body;
        let blocks = await prisma.block.findMany({orderBy: {index: 'asc'}});
        if(blocks.length === 0){
            const index = 0;
            const timestamp = new Date().toISOString();
            const previousHash = '0';
            const value = 0;
            const hash = await bcrypt.hash(`${index}${timestamp}${value}${previousHash}`, 10);
            await prisma.block.create({data: {index: 0, timestamp: new Date().toISOString(), value, previousHash, hash}});
        }
        blocks = await prisma.block.findMany({orderBy: {index: 'asc'}});

        if(!data.sender) return res.json({message: 'Sender is required'});
        if(!data.receiver) return res.json({message: 'Receiver is required'});
        if(!data.value) return res.json({message: 'Value is required'});
        if(data.value < 0) return res.json({message: 'Value must be greater than 0'});
        if(data.sender === data.receiver) return res.json({message: 'Sender and receiver must be different'});
        const sender = await prisma.user.findUnique({where: {cpf_cnpj: data.sender}, include: {blocksReceived: true, blocksSended: true}});
        if(!sender) return res.json({message: 'Sender not found'});
        const receiver = await prisma.user.findUnique({where: {cpf_cnpj: data.receiver}, include: {blocksReceived: true, blocksSended: true}});
        if(!receiver) return res.json({message: 'Receiver not found'});
        const senderBalance = sender.blocksReceived.reduce((acc, block) => acc + Number(block.value), 0) - sender.blocksSended.reduce((acc, block) => acc + Number(block.value), 0);
        if(senderBalance < data.value) return res.json({message: 'Insufficient balance'});
        
        const previousBlock = blocks[blocks.length - 1];
        const index = blocks.length;
        const timestamp = new Date().toISOString();
        const previousHash = previousBlock.hash;
        const hash = await bcrypt.hash(`${index}${timestamp}${data.value}${data.sender}${data.receiver}${previousHash}`, 10);
        await prisma.block.create({data: {index, timestamp, value: data.value, sender: data.sender, receiver: data.receiver, previousHash, hash}});
        res.json({message: 'Successfully transaction'});
    }catch(error){
        res.json({message: 'An error ocurred', error: error.message});
    }
});

app.delete('/blocks',async (req, res) => {
   await prisma.block.deleteMany(); 
    res.json({message: 'All blocks deleted'});
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    const blocks = await prisma.block.findMany({orderBy: {index: 'asc'}});
    if(blocks.length === 0){
        const index = 0;
        const timestamp = new Date().toISOString();
        const previousHash = '0';
        const value = 0;
        const hash = await bcrypt.hash(`${index}${timestamp}${value}${previousHash}`, 10);
        await prisma.block.create({data: {index: 0, timestamp: new Date().toISOString(), value, previousHash, hash}});
    }
});