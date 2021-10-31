import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../Posts/Posts';
import { UserContext } from 'App';
import '../Posts/Posts.css';
import './Profil.css';

export const UserFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [handleRerender, setHandleRerender] = useState(false);
    const [userProfil, setUserProfil] = useState({});
    const { id } = useParams();

    const rerender = () => {
        setHandleRerender(!handleRerender);
    };

    useEffect(() => {
        axios({
            method: 'POST',
            url: 'http://localhost:3001/api/public/user/getinfo/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                user_id: id
            })
        })
            .then(res => {
                console.log('PASSED THEN');
                console.log(res.data.user);
                setUserProfil(res.data.user);
            })
            .catch(err => {
                console.log('PASSED CATCH');
                console.log(err.response);
            })
            .finally(() => {
                console.log('PASSED FINALLY');
                axios({
                    method: 'POST',
                    url: 'http://localhost:3001/api/private/posts/getuser/',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.accessToken}`
                    },
                    data: JSON.stringify({
                        user_id: id
                    })
                })
                    .then(res => {
                        setPosts(res.data.posts);
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.log(err.response);
                        setIsLoading(false);
                    });
            });
    }, [handleRerender]);

    if (isLoading) return <h1>Loading posts...</h1>;

    return (
        <>
            <div className="profil-header">
                <div className="profil-info">
                    <div className="profil-img-align">
                        <img src={userProfil.avatar} alt="user profile" className="profil-img" />
                    </div>
                    <h1>{userProfil.name}</h1>
                </div>
                <div className="profil-bio">
                    <p>{userProfil.bio ? userProfil.bio : 'No super bio yet...'}</p>
                </div>
            </div>
            {posts.map(post => (
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
            ))}
        </>
    );
};
