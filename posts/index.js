/*
standard express app
*/

const express = require('express');
const  { randomBytes } = require('crypto');
const app = express();


// for simplicity, all posts will be stored in memory
const posts = {};



app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex')
});

app.listen(4000, ()=>{
    console.log('Listening on port 4000...');
})