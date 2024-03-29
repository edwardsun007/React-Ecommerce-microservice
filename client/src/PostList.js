import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

/* 
component to fetch list of posts
*/
function PostList() {
    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
        try {
            // with intro of query service, frontend need to fetch the list using query service only
            // After Ingress routing is setup, and our etc/hosts file also tweaked to include the domain
            // we can directly ask React app to sent request to that domain
            const response = await axios.get('http://myposts.com/posts'); 
            console.log(response.data);
            setPosts(response.data);
        }catch(error){
            console.error('Error fetching data:', error);
            // Handle the error appropriately in your application
        }
    };

    useEffect(()=>{
        let isMounted = true; // flag to track whether the component is mounted
        fetchPosts();

        // Cleanup function
        return () => {
            isMounted = false; // set the flag to false when component is unmounted
        };
    }, []); // empty array ensures effect run once after the components mounts
    return (
        <div className='d-flex flex-row flex-wrap justify-content-between'>
                {
                    Object.values(posts).map(
                    post=>
                        <div 
                            key={post.id}
                            className='card'
                            style={{ width: '40%', marginBottom: '20px'}}
                        >
                            <div className='card-body'>
                                <h3>{post.title}</h3>
                                <CommentList comments={post.comments}/>
                                <CommentCreate postId={post.id} key={post.id}/>
                            </div>    
                        </div>
                )}
        </div>
    )
}

export default PostList;