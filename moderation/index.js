/**
 * Comment moderation microservice
 * 
 */
const {EventTypes} = require('../utils/eventType'); // common JS syntax of importing module using require
const {ModerationStatus} = require('../utils/commentModerationType');
const express = require('express');
const bodyParser = require('body-parser');
const axois = require('axios');

const app = express();
app.use(bodyParser.json());

/*
whenever there is comment created,
this route should receive CommentCreated event, 
then filter 

*/
app.post('/events', async (req, res)=>{
    const { type, data } = req.body;

    if (type === EventTypes.CommentCreate) {
        console.log('Moderation Service received CommentCreate event...')
        // dummy logic on filtering xxx word as hentai
        const status = data.content.includes('hentai') ? ModerationStatus.REJECTED: ModerationStatus.APPROVED;
        console.log('Moderation Service check status:', status);
        try {
            // now new comment has been moderated, time to emit new event to our event-bus
            await axois.post('http://localhost:4005/events',{
                type: ModerationStatus.MODERATED,
                data:{
                    id: data.id,
                    postId: data.postId,
                    content: data.content,
                    status
                }
            });
            res.send({}); // nothing to send back to caller
        } catch (error) {
            console.log('Error on emitting comment moderated event', error);
        }
    }   
});

app.listen(4003, ()=>{
    console.log('Moderation listening on 4003 ');
});