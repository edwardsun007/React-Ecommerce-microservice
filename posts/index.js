/*
standard express app
*/

const express = require('express');
const bodyParser = require('body-parser');
const  { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());


// for simplicity, all posts will be stored in memory
const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex')
    console.log('check id=', id);
    console.log(req.body);
    const {title} = req.body;

    posts[id] = {
        id,title
    };
    // express send back res with status code
    res.status(201).send(posts[id])
});

app.listen(4000, ()=>{
    console.log('Listening on port 4000...');
})