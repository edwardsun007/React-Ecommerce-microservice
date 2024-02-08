const EventTypes = Object.freeze({
    PostCreate: 'PostCreate',
    CommentCreate:'CommentCreate',
    CommentUpdated: 'CommentUpdated'
});

module.exports = {EventTypes}; // nodeJs by default expecting common JS syntax module, do need to use module.exports instead of exports