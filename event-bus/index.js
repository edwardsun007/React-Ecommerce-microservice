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
    axios.post('http://localhost:4000/events', event);  // Post service
    axios.post('http://localhost:4001/events', event);  // Comment service
    axios.post('http://localhost:4002/events', event);  // Query Service
    axios.post('http://localhost:4003/events', event);  // Moderation Service
    // this code has flaw, currently it is just assuming all the above call can succeed
    res.send( {status: 'OK'}); 
})

// NOT really production scenario, simply a concept 
app.get('/events', (req,res)=>{
    res.send(events);
})

app.listen(4005, ()=>{
    console.log('Event-Bus listening on 4005');
});
