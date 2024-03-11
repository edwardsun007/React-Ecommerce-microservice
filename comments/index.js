/*
Comments microservice
*/
const {EventTypes} = require('./Util'); // common JS syntax of importing module using require
const {ModerationStatus} = require('./ModerationType');
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
        await axios.post('http://event-bus-clusterip-srv:4005/events',{
            type: EventTypes.CommentCreate,
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
app.post('/events', async (req, res)=>{
    console.log('Received event:', req.body)
    const {type, data} = req.body;
    if(type === ModerationStatus.MODERATED){
        const {id, postId, status, content} = data;
        const comments = commentsByPostId[postId]; // look up the comments by postId
        const comment = comments.find(comment=>{
            return comment.id === id; // match with moderated event passed comment id
        });
        comment.status = status; // update status
        // now we can tell event-bus that comment has been updated
        await axios.post('http://event-bus-clusterip-srv:4005/events',{
            type: EventTypes.CommentUpdated,
            data: {
                id,
                postId,
                status,
                content
            }
        });
    }

    res.send({})
})

// each microservice need to use unique port
app.listen(4001, ()=>{
    console.log("V68 comment svc");
    console.log('Comment service Listening on port 4001...');
});