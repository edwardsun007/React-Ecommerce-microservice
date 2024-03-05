/*
Post microservice
standard express app
*/
const {EventTypes} = require('./Util'); // common JS syntax of importing module using require
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
    try {
        await axios.post('http://localhost:4005/events', {
            type: EventTypes.PostCreate,
            data: {
                id,
                title
            }
        });
        // express send back res with status code
        res.status(201).send(posts[id])
    } catch (error) {
        console.error('Error emitting event to event-bus:', error);
    }
});

// postCreate event listener:
/**
 * whenever event-bus send event over, this handler will be triggered
 */
app.post('/events',(req, res)=>{
    console.log('Received event:', req.body)
    res.send( {status: 'OK'})
})

app.listen(4000, () => {
    console.log('v60');
    console.log('Post service listening on port 4000...');
})