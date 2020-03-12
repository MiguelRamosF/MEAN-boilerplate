const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts')

const app = express();

mongoose.connect("mongodb+srv://miramos:Nz4jw4hs5sz3IOev@cluster0-ogns0.mongodb.net/mean-app?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connection succeded !");
    })
    .catch(() => {
        console.log("DB connection failed !");
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;