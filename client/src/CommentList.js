import React from 'react'

function CommentList(props) {
    const {comments} = props; // destruct it inside

    const renderComments = comments.map(
        comment=>{
            return <li key={comment.id}>{comment.content}</li>
        }
    )
    return (
        <ul>
            {renderComments}
        </ul>
    )
}

export default CommentList