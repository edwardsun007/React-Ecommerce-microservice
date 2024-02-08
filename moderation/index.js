const express = require('express');
const bodyParser = require('body-parser');
const axois = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res)=>{

});

app.listen(4003, ()=>{
    console.log('Moderation listening on 4003 ');
});