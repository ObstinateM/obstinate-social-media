// React & Axios
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Context
import { UserContext } from 'Context/UserContext';

// CSS
import './Posts.css';

export function Post({ id, avatar, username, authorId, content, contentImg, canDelete, rerender }) {
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
                {canDelete ? (
                    <button onClick={handleDelete}>
                        <img src="http://localhost:3000/images/bin.png" alt="Delete" />
                    </button>
                ) : null}
                <button>
                    <img src="http://localhost:3000/images/heart-outline.png" alt="Like" />
                </button>
                <Link to={`/post/${id}`}>
                    <img src="http://localhost:3000/images/chat.png" alt="Comment" />
                </Link>
                <button>
                    <img src="http://localhost:3000/images/share.png" alt="Share" />
                </button>
            </div>
        </div>
    );
}
