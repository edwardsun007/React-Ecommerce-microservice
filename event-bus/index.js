const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json())

app.post('/events', (req, res)=>{
    const event = req.body;
    // whenever there is event received, we will then make a series of events call to posts, comments
    axios.post('http://localhost:4000/events', events);
    axios.post('http://localhost:4001/events', events);
    axios.post('http://localhost:4002/events', events);
    // this code has flaw, currently it is just assuming all the above call can succeed

    res.send( {status: 'OK'});
})
