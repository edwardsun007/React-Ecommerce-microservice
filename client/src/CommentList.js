import React, {useState, useEffect} from 'react'
import axios from 'axios';

function CommentList(props) {
    const {postId} = props; // destruct it inside

    const [comments, setComments] = useState([]);

    const fetchCommentsForPost = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
            console.log(response.data);
            setComments(response.data);
        }catch(error){
            console.error('Error fetching comments:', error);
            // Handle the error appropriately in your application
        }
    };

    useEffect(()=>{
        let isMounted = true; // flag to track whether the component is mounted
        fetchCommentsForPost();

        // Cleanup function
        return () => {
            isMounted = false; // set the flag to false when component is unmounted
        };
    }, []); // empty array ensures effect run once after the components mounts

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