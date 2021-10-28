import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Posts.css';
import { UserContext } from 'App';

export const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);

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
    }, []);

    if (isLoading) return <h1>Loading posts...</h1>;

    return posts.map(post => (
        <Post
            key={post.id}
            avatar={post.avatar}
            username={post.author}
            content={post.content}
            contentImg={post.contentImg}
        />
    ));
};

const Post = ({ avatar, username, content, contentImg }) => {
    return (
        <div className="post">
            <div className="post-top">
                <img src={avatar} alt="user profile" className="profil-img" />
                <div className="content">
                    <Link className="content-title" to={username}>
                        {username}
                    </Link>
                    <p className="content-text">{content}</p>
                    {contentImg && <img src={contentImg} alt="" className="post-img" />}
                </div>
            </div>
            <div className="action">
                <button>Like</button>
                <button>Comments</button>
                <button>Share</button>
            </div>
        </div>
    );
};
