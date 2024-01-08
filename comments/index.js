const express = require('express');
const bodyParser = require('body-parser');
const  { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

// create post comment and get all comment for post API
app.get('/posts/:id/comments', (req, res)=>{
    console.log(`fetching comments for ${req.params.id}`)
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res)=>{
    console.log(`creating comment for ${req.params.id}`) 
    // generate new comment id
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;  

    // check if there are existing comments
    const comments = commentsByPostId[req.params.id] || []// if undefined, then result to empty list using || here
    comments.push(
        {
            id: commentId,
            content
        }
    );
    commentsByPostId[req.params.id]=comments;
    res.status(201).send(comments);
});

// each microservice need to use unique port
app.listen(4001, ()=>{
    console.log('Listening on port 4001...');
});