// React & Axios
import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Context
import { UserContext } from 'Context/UserContext';

export function CommentFeed() {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [handleRerender, setHandleRerender] = useState(false);
    const { id } = useParams();

    const rerender = () => {
        setHandleRerender(!handleRerender);
    };

    useEffect(() => {
        axios({
            method: 'POST',
            url: 'http://localhost:3001/api/private/comments/getall',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.accessToken}`
            },
            data: JSON.stringify({
                post_id: id
            })
        })
            .then(res => {
                console.log(res.data);
                setComments(res.data.comments);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response);
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleRerender]);

    if (isLoading) return <h1>Loading comments...</h1>;

    return comments.map(comment => (
        <Comment
            key={comment.id}
            id={comment.id}
            avatar={comment.avatar}
            username={comment.author}
            authorId={comment.id_user}
            content={comment.content}
            canDelete={comment.id_user === user.id}
            rerender={rerender}
        />
    ));
}

function Comment({ id, avatar, username, authorId, content, canDelete, rerender }) {
    const { user } = useContext(UserContext);

    const handleDelete = () => {
        console.log(id);
        axios({
            method: 'DELETE',
            url: 'http://localhost:3001/api/private/comments/delete',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
            data: JSON.stringify({
                comment_id: id
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
                </div>
            </div>
            <div className="action">{canDelete ? <button onClick={handleDelete}>Delete</button> : null}</div>
        </div>
    );
}
