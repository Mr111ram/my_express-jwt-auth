const express = require('express');
const mongoose = require('mongoose');
const { MONGO } = require('./.config.js');
const authRouter = require('./authRouter.js');

const PORT = process.env.PORT || 3000;

const app = express ();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
    try {
        await mongoose.connect(MONGO);
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        })
    } catch (e) {
        console.error(e.message);
    }
}

start().then(r => r && console.log('Start then: ', r));