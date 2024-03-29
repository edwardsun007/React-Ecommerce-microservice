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

// Create POST API
// Differentiate the route by adding create suffix 
// because ingress controller doesn't differentiate based on API method like POST or GET
app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    console.log('check id=', id);
    const {title} = req.body;

    posts[id] = {
        id,title
    };
    // emit event to event-bus
    try {
        await axios.post('http://event-bus-clusterip-srv:4005/events', { 
            // after we created ClusterIP service for event-bus, need to wire it up with the clusterIp service name
            // check the config in event-bus-depl.yaml
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
    console.log('Post MicroService Received Event from event-bus:', req.body)
    res.send( {status: 'OK'})
})

app.listen(4000, () => {
    console.log('v68');
    console.log('Post service listening on port 4000...');
})