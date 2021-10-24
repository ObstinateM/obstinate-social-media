import React, { useState, useEffect } from 'react';
import './Posts.css';

export const Feed = () => {
    const [posts, setPosts] = useState([
        {
            img: 'https://lh3.googleusercontent.com/a-/AOh14Gg1eiJhr7ZUBAw2K_TadASYlwpIf6Z6dcZIXBXqWA=s96-c',
            username: 'cc',
            content: 'lorem30'
        },
        {
            img: 'https://lh3.googleusercontent.com/a-/AOh14Gg1eiJhr7ZUBAw2K_TadASYlwpIf6Z6dcZIXBXqWA=s96-c',
            username: 'CAVA',
            content: 'lorem30'
        },
        {
            img: 'https://lh3.googleusercontent.com/a-/AOh14Gg1eiJhr7ZUBAw2K_TadASYlwpIf6Z6dcZIXBXqWA=s96-c',
            username: 'SUPER',
            content: 'lorem30'
        },
        {
            img: 'https://lh3.googleusercontent.com/a-/AOh14Gg1eiJhr7ZUBAw2K_TadASYlwpIf6Z6dcZIXBXqWA=s96-c',
            username: 'NIQUEL',
            content: 'lorem30'
        },
        {
            img: 'https://lh3.googleusercontent.com/a-/AOh14Gg1eiJhr7ZUBAw2K_TadASYlwpIf6Z6dcZIXBXqWA=s96-c',
            username: 'ET TOI ?',
            content: 'lorem30',
            contentImg: 'https://via.placeholder.com/1920x3000'
        }
    ]);
    console.log('passed');
    // useEffect(() => {
    //     const fetchAPI = async () => {
    //         const res = await fetch('localhost:3001/');
    //     };
    //     fetchAPI();
    // }, []);

    return posts.map(post => (
        <Post img={post.img} username={post.username} content={post.content} contentImg={post.contentImg} />
    ));
};

const Post = ({ img, username, content, contentImg }) => {
    console.log('passed');
    return (
        <div class="post">
            <div class="post-top">
                <img src={img} alt="user profile" class="profil-img" />
                <div class="content">
                    <a class="content-title" href="#">
                        {username}
                    </a>
                    <p class="content-text">{content}</p>
                    {contentImg && <img src={contentImg} alt="" class="post-img" />}
                </div>
            </div>
            <div class="action">
                <a href="#">Like</a>
                <a href="#">Comments</a>
                <a href="#">Share</a>
            </div>
        </div>
    );
};
