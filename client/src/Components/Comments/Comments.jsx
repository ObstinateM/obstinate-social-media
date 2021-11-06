// React & Axios
import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Components
import { Post } from 'Components/Posts/Posts';

// Context
import { UserContext } from 'Context/UserContext';

export function CommentFeed() {
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [handleRerender, setHandleRerender] = useState(false);
    const { id } = useParams();

    const rerender = () => {
        setHandleRerender(!handleRerender);
    };

    // TODO: Add main post
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
                console.log(res.data.comments);
                setPost(res.data.comments[0]);
                setComments(res.data.comments.slice(1));
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response);
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleRerender]);

    if (isLoading) return <h1>Loading comments...</h1>;
    return (
        <>
            <Post post={post} canDelete={user.id === post.id_user} render={() => {}} highlight={true} />
            {comments.length ? (
                comments.map(comment => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        canDelete={comment.id_user === user.id}
                        rerender={rerender}
                    />
                ))
            ) : (
                <h3>No comments yet...</h3>
            )}
        </>
    );
}

function Comment({ comment, canDelete, rerender }) {
    const { user } = useContext(UserContext);

    const handleDelete = () => {
        console.log(comment.id);
        axios({
            method: 'DELETE',
            url: 'http://localhost:3001/api/private/comments/delete',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
            data: JSON.stringify({
                comment_id: comment.id
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
                <img src={comment.avatar} alt="user profile" className="profil-img" />
                <div className="content">
                    <Link className="content-title" to={`/profil/${comment.id_user}`}>
                        {comment.author}
                    </Link>
                    <p className="content-text">{comment.content}</p>
                </div>
            </div>
            <div className="action">{canDelete ? <button onClick={handleDelete}>Delete</button> : null}</div>
        </div>
    );
}
