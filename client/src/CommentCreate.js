import React, {useState} from 'react';
import axios from 'axios';

function CommentCreate(props) {
    const {postId} = props; // destruct it inside
    const [commentContent, setCommentContent] = useState('');

    const onSubmitHandler = async(event) => {
        event.preventDefault();
        await axios.post(
            `http://localhost:4001/posts/${postId}/comments`,
            {
                content: commentContent
            });
        setCommentContent('');
    }

    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <div className='form-group'>
                    <label>New Comment</label>
                    <input value={commentContent} className='form-control' onChange={e=>setCommentContent(e.target.value)}/>
                    {/* using value={commentContent} in your input field makes your form input a controlled component in React, 
                    which gives you more control and predictability over the form's behavior and the value of its inputs. */}
                </div>
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    )
}

export default CommentCreate