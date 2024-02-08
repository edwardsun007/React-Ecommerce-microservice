/**
 * QUERY Microservice:
 * This service will be listening for both postCreate event and commentCreate event
 * and it will structuring payload in proper format and return it
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const {EventTypes} = require('../utils/eventType'); // common JS syntax of importing module using require

const app = new express();
app.use(bodyParser.json());
app.use(cors());

/*
posts is object that is going to be structured as below
// posts = {
//     'postid': {
//         id: 'postId',
//         title: 'post title',
//         comments:[
//             { id: 'comment_id', content: 'comment1'},
//             { id: 'comment_id', content: 'comment2'}
//         ]
//     }
// }
*/
const posts = {}; 


const handleEventHelper = (type, data) => {
    if(type === EventTypes.PostCreate){
        const { id, title } = data;
        posts[id] = {id, title, comments: []} // store this post in the object

    }

    if(type === EventTypes.CommentCreate){
        console.log('query service received CommentCreate event, handling...')
        const {id, content, postId, status} = data; // now comment has status, make sure to pull it
        posts[postId].comments.push({id, content, status}); // store message with status
    }

    // watch for commentUpdated event
    if(type === EventTypes.CommentUpdated){
        console.log('Query service got CommentUpdated:', data); 
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment=>comment.id===id); // find the exact comment in the array
        comment.status = status; // update its status
        comment.content = content; // we cannot be sure if there are other changes happened to comment content, so just update it as well
    }
}

app.get('/posts', (req, res)=>{
    console.log('query service sending posts now...');
    res.send(posts);
})

// receive events from our event-bus
app.post('/events', (req, res)=>{
    const {type, data} = req.body;

    handleEventHelper(type, data);
    res.send({}); // since the object has been updated in posts, we dont need to send back anything
});

app.listen(4002, async()=> {
    console.log('Query service listening on 4002');
    try {
        /**
         * Just concept, not really production scenario. when query service recover, it needs to fetch all events stored from event-buss
         * and call helper above to process each event
         */
        const res = await axios.get("http://localhost:4005/events") // call to fetch all events stored in event-bus
        for (let event of res.data){
            console.log("Processing event:", event.type);
            handleEventHelper(event.type, event.data);
        }
    } catch (error) {
        console.log(error.message);
    }
});