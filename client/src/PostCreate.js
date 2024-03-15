import React, {useState} from 'react'
import axios from 'axios';

function PostCreate() {
    const [title, setTitle] = useState('');

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        await axios.post(
            // After Ingress routing is setup, and our etc/hosts file also tweaked to include the domain
            // we can directly ask React app to sent request to that domain
            'http://myposts.com/posts', 
            {
              title: title
            });
        setTitle('');// after successful creation post, clear the title input
    }

    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <div className='form-group'>
                    <label>Title</label>
                    <input  onChange={e=>setTitle(e.target.value)} className='form-control'/>
                </div>
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    )
}

export default PostCreate