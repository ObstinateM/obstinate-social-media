// React & Axios
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Components
import { Post } from '../Posts/Posts';

// Context
import { UserContext } from 'Context/UserContext';

// CSS
import '../Posts/Posts.css';
import './Profil.css';

export function UserFeed() {
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
                console.log(res.data.user);
                setUserProfil(res.data.user);
            })
            .catch(err => {
                console.log(err.response);
            })
            .finally(() => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
}
