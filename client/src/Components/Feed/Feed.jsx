// React & Axios
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Components
import { Post } from 'Components/Posts/Posts';
import { UserContext } from 'Context/UserContext';
import './Feed.css';

export function Feed() {
    const [posts, setPosts] = useState([]);
    const [followPost, setFollowPost] = useState([]);
    const [followFeed, setFollowFeed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [handleRerender, setHandleRerender] = useState(false);

    const rerender = () => {
        setHandleRerender(!handleRerender);
    };

    useEffect(() => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_APIHOST}/api/private/posts/getallposts`,
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

        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_APIHOST}/api/private/posts/getallfollow`,
            headers: { Authorization: `Bearer ${user.accessToken}` }
        })
            .then(res => {
                setFollowPost(res.data.posts);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response);
                setIsLoading(false);
            });
    }, [handleRerender]);

    if (isLoading) return <h1>Loading posts...</h1>;

    return (
        <>
            <div className="feed-choice">
                <button onClick={() => setFollowFeed(false)} className="chatnav-createbutton">
                    All posts
                </button>
                <button onClick={() => setFollowFeed(true)} className="chatnav-createbutton">
                    Following posts
                </button>
            </div>
            {followFeed
                ? followPost.map(post => (
                      <Post key={post.id} post={post} canDelete={post.id_user === user.id} rerender={rerender} />
                  ))
                : posts.map(post => (
                      <Post key={post.id} post={post} canDelete={post.id_user === user.id} rerender={rerender} />
                  ))}
        </>
    );
}
