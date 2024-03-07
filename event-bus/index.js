const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json())

// mimic in memory events data store so that when query service came back online,it can drain all events stored here
const events = [];

app.post('/events', (req, res)=>{
    const event = req.body;
    events.push(event);

    // whenever there is event received, we will then make a series of events call to posts, comments
    // the following catch chaining is added due to breaking change of Node v15: https://nodejs.medium.com/node-js-v15-0-0-is-here-deb00750f278
    axios.post('http://posts-clusterip-srv:4000/events', event).catch((err)=>{
        // since we created ClusterIP service, we have to wire it up with the exact name used in posts-deployment.yaml
        console.log(err);
    });  // Post service
    // axios.post('http://localhost:4001/events', event).catch((err)=>{
    //     console.log(err);
    // });  // Comment service
    // axios.post('http://localhost:4002/events', event).catch((err)=>{
    //     console.log(err);
    // });  // Query Service
    // axios.post('http://localhost:4003/events', event).catch((err)=>{
    //     console.log(err);
    // });  // Moderation Service
    // this code has flaw, currently it is just assuming all the above call can succeed
    res.send( {status: 'OK'}); 
})

// NOT really production scenario, simply a concept 
app.get('/events', (req,res)=>{
    res.send(events);
});

app.listen(4005, ()=>{
    console.log("Event-bus v.68")
    console.log('Event-Bus listening on 4005');
});
