import React from 'react';
import ModerationStatus from './ModerationTypes';

function CommentList(props) {
    const {comments} = props; // destruct it inside

    const renderComments = comments.map(
        comment=>{
            let content;
            if(comment.status === ModerationStatus.APPROVED){
                content = comment.content;
            }
            if(comment.status === ModerationStatus.REJECTED){
                content = 'Your content is removed! Find out why.'
            }
            if(comment.status === ModerationStatus.PENDING){
                content ='Content is being moderated'
            }
            return <li key={comment.id}>{ content }</li>
        }
    )
    return (
        <ul>
            {renderComments}
        </ul>
    )
}

export default CommentList