/*
Post microservice
standard express app
*/
const {Types} = require('../utils/eventType'); // common JS syntax of importing module using require
const express = require('express');
const bodyParser = require('body-parser');
const  { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// for simplicity, all posts will be stored in memory
const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    console.log('check id=', id);

    const {title} = req.body;

    posts[id] = {
        id,title
    };
    // emit event to event-bus
    await axios.post('http://localhost:4005/events', {
        type: Types.PostCreate,
        data: {
            id,
            title
        }
    }) 

    // express send back res with status code
    res.status(201).send(posts[id])
});

app.listen(4000, ()=>{
    console.log('Listening on port 4000...');
})