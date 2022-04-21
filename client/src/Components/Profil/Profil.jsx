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
    const [isFollowing, setIsFollowing] = useState(false);
    const { id } = useParams();

    const rerender = () => {
        setHandleRerender(!handleRerender);
    };

    useEffect(() => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_APIHOST}/api/public/user/getinfo/`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                user_id: id
            })
        })
            .then(res => {
                setUserProfil(res.data.user);
            })
            .catch(err => {
                console.log(err.response);
            })
            .finally(() => {
                axios({
                    method: 'POST',
                    url: `${process.env.REACT_APP_APIHOST}/api/private/posts/getuser/`,
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

                // Look if the user is following the page
                if (!(Number(id) === Number(user.id))) {
                    axios
                        .get(`${process.env.REACT_APP_APIHOST}/api/private/follow/follow?follow=${id}`, {
                            headers: {
                                Authorization: `Bearer ${user.accessToken}`
                            }
                        })
                        .then(res => {
                            setIsFollowing(res.data.isFollowing);
                        })
                        .catch(err => {
                            console.log(err.response);
                        });
                }
            });
    }, [handleRerender]);

    const onFollow = () => {
        axios
            .post(
                `${process.env.REACT_APP_APIHOST}/api/private/follow/follow`,
                {
                    follow: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                }
            )
            .then(res => {
                setIsFollowing(!isFollowing);
            })
            .catch(err => {
                console.log(err.response);
            });
    };

    if (isLoading) return <h1>Loading posts...</h1>;

    return (
        <>
            <div className="profil-header">
                <div className="profil-info">
                    <div className="profil-img-align">
                        <img src={userProfil.avatar} alt="user profile" className="profil-img" />
                    </div>
                    <h1>{userProfil.name}</h1>
                    {!(Number(id) === Number(user.id)) && (
                        <button className="chatnav-createbutton" onClick={onFollow}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
                <div className="profil-bio">
                    <p>{userProfil.bio ? userProfil.bio : 'No super bio yet...'}</p>
                </div>
            </div>
            {posts.map(post => (
                <Post key={post.id} post={post} canDelete={post.id_user === user.id} rerender={rerender} />
            ))}
        </>
    );
}
