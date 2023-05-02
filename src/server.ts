import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.get('/blocks', async (req, res) => {
    const blocks = await prisma.block.findMany();
    res.json(blocks);
});

app.get('/blocks/validate', async (req, res) => {
    try{
        const blocks = await prisma.block.findMany();
        let isValid = false;
        if(blocks.length === 1) return res.json({isValid: true});
        for(let i = 1; i < blocks.length; i++){
            const block = blocks[i];
            const previousBlock = blocks[i - 1];
            console.log(`Previous hash = ${block.previousHash}`);
            console.log(`Previous block hash = ${previousBlock.hash}`);
            const hashIsValid = await bcrypt.compare(`${block.index}${block.timestamp}${block.data}${block.previousHash}`, block.hash);
            console.log(`Hash is valid = ${hashIsValid}`);

            isValid = (block.previousHash === previousBlock.hash) && hashIsValid;
        }
        res.json({isValid});
    }catch(error){
        res.json({message: 'An error ocurred', error: error.message});
    }
});

app.post('/blocks', async (req, res) => {
    try{
        const {data} = req.body;
        const blocks = await prisma.block.findMany();
        const previousBlock = blocks[blocks.length - 1];
        const index = blocks.length;
        const timestamp = new Date().toISOString();
        const previousHash = previousBlock.hash;
        const jsonData = JSON.stringify(data).toString();
        const hash = await bcrypt.hash(`${index}${timestamp}${jsonData}${previousHash}`, 10);
        await prisma.block.create({data: {index, timestamp, data: jsonData, previousHash, hash}});
        res.json({message: 'Suceessfully transaction'});
    }catch(error){
        res.json({message: 'An error ocurred', error: error.message});
    }
});

app.delete('/blocks',async (req, res) => {
   await prisma.block.deleteMany(); 
    res.json({message: 'All blocks deleted'});
});

app.listen(3000, async () => {
    console.log('Server is running on port 3000');
    const blocks = await prisma.block.findMany();
    if(blocks.length === 0){
        const index = 0;
        const timestamp = new Date().toISOString();
        const data = 'Genesis Block';
        const previousHash = '0';
        const hash = await bcrypt.hash(`${index}${timestamp}${data}${previousHash}`, 10);
        await prisma.block.create({data: {index: 0, timestamp: new Date().toISOString(), data: 'Genesis Block', previousHash, hash}});
    }
});