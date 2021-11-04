// React & Axios
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Components
import { Post } from 'Components/Posts/Posts';
import { UserContext } from 'Context/UserContext';

export function Feed() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [handleRerender, setHandleRerender] = useState(false);

    const rerender = () => {
        setHandleRerender(!handleRerender);
    };

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:3001/api/private/posts/getallposts',
            headers: { Authorization: `Bearer ${user.accessToken}` }
        })
            .then(res => {
                setPosts(res.data.posts);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response);
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleRerender]);

    if (isLoading) return <h1>Loading posts...</h1>;

    return posts.map(post => (
        <Post
            key={post.id}
            id={post.id}
            avatar={post.avatar}
            username={post.author}
            authorId={post.id_user}
            content={post.content}
            contentImg={post.contentImg}
            canDelete={post.id_user === user.id}
            rerender={rerender}
        />
    ));
}
