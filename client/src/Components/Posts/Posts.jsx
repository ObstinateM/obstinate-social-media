import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from 'App';
import toast from 'react-hot-toast';
import './Posts.css';

export const Feed = () => {
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
};

export const Post = ({ id, avatar, username, authorId, content, contentImg, canDelete, rerender }) => {
    const { user } = useContext(UserContext);

    const handleDelete = () => {
        console.log(id);
        axios({
            method: 'DELETE',
            url: 'http://localhost:3001/api/private/posts/delete',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
            data: JSON.stringify({
                post_id: id
            })
        })
            .then(_ => {
                toast.success('Successfully deleted');
                rerender();
            })
            .catch(_ => {
                toast.error('Cant delete this post');
            });
    };

    return (
        <div className="post">
            <div className="post-top">
                <img src={avatar} alt="user profile" className="profil-img" />
                <div className="content">
                    <Link className="content-title" to={`/profil/${authorId}`}>
                        {username}
                    </Link>
                    <p className="content-text">{content}</p>
                    {contentImg && <img src={contentImg} alt="" className="post-img" />}
                </div>
            </div>
            <div className="action">
                {canDelete ? <button onClick={handleDelete}>Delete</button> : null}
                <button>Like</button>
                <button>Comments</button>
                <button>Share</button>
            </div>
        </div>
    );
};
