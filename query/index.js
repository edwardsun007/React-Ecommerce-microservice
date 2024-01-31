/**
 * QUERY Microservice:
 * This service will be listening for both postCreate event and commentCreate event
 * and it will structuring payload in proper format and return it
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = new express();
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res)=>{

})

// receive events from our event-bus
app.post('/events', (req, res)=>{
    
});

app.listen(4002, ()=>{
    console.log('listening on 4002');
});