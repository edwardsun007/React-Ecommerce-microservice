/*
Comments microservice
*/
const {Types} = require('../utils/eventType'); // common JS syntax of importing module using require
const {ModerationStatus} = require('../utils/commentModerationType');
const express = require('express');
const bodyParser = require('body-parser');
const  { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// create post comment and get all comment for post API
app.get('/posts/:id/comments', (req, res)=>{
    console.log(`fetching comments for ${req.params.id}`)
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res)=>{
    console.log(`creating comment for ${req.params.id}`) 
    // generate new comment id
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;  

    // check if there are existing comments
    const comments = commentsByPostId[req.params.id] || []// if undefined, then result to empty list using || here
    // new comment by default assign status of pending since it is not filtered yet
    comments.push(
        {
            id: commentId,
            content,
            status: ModerationStatus.PENDING
        }
    );
    commentsByPostId[req.params.id]=comments;
    // emit event to event-bus
    try {
        await axios.post('http://localhost:4005/events',{
            type: Types.CommentCreate,
            data: {
                id: commentId,
                content,
                postId: req.params.id,
                status: ModerationStatus.PENDING
            }
        })
        res.status(201).send(comments);
    } catch (error) {
        console.error(error.message);
    }

});

// CommentCreate event listener:
/**
 * whenever event-bus send event over, this handler will be triggered
 */
app.post('/events',(req, res)=>{
    console.log('Received event:', req.body)
    res.send( {status: 'OK'})
})

// each microservice need to use unique port
app.listen(4001, ()=>{
    console.log('Comment service Listening on port 4001...');
});