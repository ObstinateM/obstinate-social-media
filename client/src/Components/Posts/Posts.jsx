// React & Axios
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Context
import { UserContext } from 'Context/UserContext';

// CSS
import './Posts.css';

export function Post({ post, canDelete, rerender, highlight = false }) {
    const { user } = useContext(UserContext);

    // TODO: Handle Like and Unlike
    function handleDelete() {
        console.log(post.id);
        axios({
            method: 'DELETE',
            url: `${process.env.REACT_APP_APIHOST}/api/private/posts/delete`,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
            data: JSON.stringify({
                post_id: post.id
            })
        })
            .then(_ => {
                toast.success('Successfully deleted');
                rerender();
            })
            .catch(_ => {
                toast.error('Cant delete this post');
            });
    }

    function handleLike() {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_APIHOST}/api/private/posts/like`,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
            data: JSON.stringify({
                post_id: post.id
            })
        })
            .then(() => rerender())
            .catch(err => {
                toast.error(`An error has occured. Please retry ${err}`);
            });
    }

    function handleShare() {
        navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTHOST}/post/${post.id}`).then(
            () => {
                toast('Link copied to clipboard.', { duration: 3000, icon: 'ℹ️' });
            },
            _ => {
                toast.error('Unable to copy the link.');
            }
        );
    }

    return (
        <div className={highlight ? 'post highlight' : 'post'}>
            <div className="post-top">
                <img src={post.avatar} alt="user profile" className="profil-img" />
                <div className="content">
                    <Link className="content-title" to={`/profil/${post.id_user}`}>
                        {post.author}
                    </Link>
                    <p className="content-text">{post.content}</p>
                    {post.contentImg && <img src={post.contentImg} alt="" className="post-img" />}
                </div>
            </div>
            <div className="action">
                <div className="nbLikes">
                    <p>
                        {post.nbLikes} {post.nbLikes > 1 ? 'Likes' : 'Like'}
                    </p>
                </div>
                {canDelete ? (
                    <button onClick={handleDelete}>
                        <img src={`${process.env.REACT_APP_FRONTHOST}/images/bin.png`} alt="Delete" />
                    </button>
                ) : null}
                {post.isLiked ? (
                    <button onClick={handleLike}>
                        <img src={`${process.env.REACT_APP_FRONTHOST}/images/heart-filled.png`} alt="Like" />
                    </button>
                ) : (
                    <button onClick={handleLike}>
                        <img src={`${process.env.REACT_APP_FRONTHOST}/images/heart-outline.png`} alt="Like" />
                    </button>
                )}
                <Link to={`/post/${post.id}`}>
                    <img src={`${process.env.REACT_APP_FRONTHOST}/images/chat.png`} alt="Comment" />
                </Link>
                <button onClick={handleShare}>
                    <img src={`${process.env.REACT_APP_FRONTHOST}/images/share.png`} alt="Share" />
                </button>
            </div>
        </div>
    );
}
