// React & Axios
import { useState, useEffect, useContext, useRef } from 'react';
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

    useEffect(() => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_APIHOST}/api/private/comments/getall`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.accessToken}`
            },
            data: JSON.stringify({
                post_id: id
            })
        })
            .then(res => {
                setPost(res.data.comments[0]);
                setComments(res.data.comments.slice(1));
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleRerender]);

    if (isLoading) return <h1>Loading comments...</h1>;
    return (
        <>
            <Post
                post={post}
                canDelete={user.id === post.id_user}
                render={() => {}}
                highlight={true}
                rerender={rerender}
            />
            {comments.map(comment => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    canDelete={comment.id_user === user.id}
                    rerender={rerender}
                />
            ))}
            <CreateNewComment rerender={rerender} isCommentsEmpty={comments.length <= 0} />
        </>
    );
}

function Comment({ comment, canDelete, rerender }) {
    const { user } = useContext(UserContext);

    const handleDelete = () => {
        axios({
            method: 'DELETE',
            url: `${process.env.REACT_APP_APIHOST}/api/private/comments/delete`,
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

    // WARNING: The content is replaced by comment.image because of the SQL query
    return (
        <div className="post">
            <div className="post-top">
                <img src={comment.avatar} alt="user profile" className="profil-img" />
                <div className="content">
                    <Link className="content-title" to={`/profil/${comment.id_user}`}>
                        {comment.author}
                    </Link>
                    <p className="content-text">{comment.image}</p>
                </div>
            </div>
            <div className="action">{canDelete ? <button onClick={handleDelete}>Delete</button> : null}</div>
        </div>
    );
}

function CreateNewComment({ rerender, isCommentsEmpty }) {
    const [isLoading, setIsLoading] = useState(false);
    const newComment = useRef(null);
    const { user } = useContext(UserContext);
    const { id } = useParams();

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_APIHOST}/api/private/comments/create`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.accessToken}`
            },
            data: JSON.stringify({
                post_id: id,
                content: newComment.current.value
            })
        })
            .then(_ => {
                toast.success('Successfully created');
                newComment.current.value = '';
                setIsLoading(false);
                rerender();
            })
            .catch(_ => {
                toast.error('Cant create this comment');
                setIsLoading(false);
            });
    };

    return (
        <>
            <div className="post">
                <div className="comment-box">
                    <form onSubmit={handleSubmit}>
                        <textarea ref={newComment} placeholder="Write a comment..." />
                        <button className="comment-button" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
            {isCommentsEmpty ? <h3 className="no-comment">No comments yet...</h3> : null}
        </>
    );
}
