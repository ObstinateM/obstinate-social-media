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
            url: 'http://localhost:3001/api/private/posts/delete',
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

    function handleShare() {
        navigator.clipboard.writeText(`http://localhost:3000/post/${post.id}`).then(
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
                    <p>{post.nbLikes} J'aime</p>
                </div>
                {canDelete ? (
                    <button onClick={handleDelete}>
                        <img src="http://localhost:3000/images/bin.png" alt="Delete" />
                    </button>
                ) : null}
                {post.isLiked ? (
                    <button>
                        <img src="http://localhost:3000/images/heart-filled.png" alt="Like" />
                    </button>
                ) : (
                    <button>
                        <img src="http://localhost:3000/images/heart-outline.png" alt="Like" />
                    </button>
                )}
                <Link to={`/post/${post.id}`}>
                    <img src="http://localhost:3000/images/chat.png" alt="Comment" />
                </Link>
                <button onClick={handleShare}>
                    <img src="http://localhost:3000/images/share.png" alt="Share" />
                </button>
            </div>
        </div>
    );
}
