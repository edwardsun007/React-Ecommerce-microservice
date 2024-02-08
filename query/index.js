/**
 * QUERY Microservice:
 * This service will be listening for both postCreate event and commentCreate event
 * and it will structuring payload in proper format and return it
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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


app.get('/posts', (req, res)=>{
    console.log('query service sending posts now...');
    res.send(posts);
})

// receive events from our event-bus
app.post('/events', (req, res)=>{
    const {type, data} = req.body;
    if(type === EventTypes.PostCreate){
        const { id, title } = data;
        posts[id] = {id, title, comments: []} // store this post in the object

    }

    if(type === EventTypes.CommentCreate){
        const {id, content, postId, status} = data; // now comment has status, make sure to pull it
        posts[postId].comments.push({id, content, status}); // store message with status
    }

    console.log('query checking posts:')
    console.log(posts);
    res.send({}); // since the object has been updated in posts, we dont need to send back anything
});

app.listen(4002, ()=>{
    console.log('Query service listening on 4002');
});