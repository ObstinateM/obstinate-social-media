// React
import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';

// Context
import { UserContext } from 'Context/UserContext';

// Style
import './Setting.css';
import toast from 'react-hot-toast';

export function SettingPage() {
    const user = useContext(UserContext);
    const bioRef = useRef(null);
    const [newDesc, setNewDesc] = useState(false);
    const [newAvatar, setNewAvatar] = useState(false);
    const [file, setFile] = useState(null);

    const handleChangeDesc = () => {
        axios
            .post(
                `${process.env.REACT_APP_APIHOST}/api/private/user/bio`,
                {
                    bio: bioRef.current.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.user.accessToken}`
                    }
                }
            )
            .then(res => {
                toast.success('Description updated');
                user.refreshToken(true);
                setNewDesc(false);
            })
            .catch(err => {
                console.log(err);
                toast.error('Something went wrong');
            });
    };

    const onChangeImage = e => {
        setFile(e.target.files[0]);
    };

    const uploadImage = e => {
        e.preventDefault();
        if (file) {
            let body = new FormData();
            body.append('avatar', file);
            const headers = {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${user.user.accessToken}`
            };
            axios
                .post(`${process.env.REACT_APP_APIHOST}/api/private/user/avatar`, body, {
                    withCredentials: true,
                    headers
                })
                .then(res => {
                    console.log(res);
                    user.refreshToken(true);
                    toast.success('Image uploaded successfully');
                })
                .catch(err => {
                    console.error(err.response);
                    toast.error('Image upload failed');
                });
        } else {
            toast.error('No image provided');
        }
    };

    return (
        <>
            <div className="profil-header">
                <div className="profil-info">
                    <div className="profil-img-align">
                        <img src={user.user.avatar} alt="user profile" className="profil-img" />
                    </div>
                    <h1>{user.user.name}</h1>
                </div>
                <div className="profil-bio">
                    <p>{user.user.bio ? user.user.bio : 'No super bio yet...'}</p>
                </div>
                <div className="button-box">
                    <button className="chatnav-createbutton" onClick={() => setNewDesc(!newDesc)}>
                        Change Description
                    </button>
                    <button className="chatnav-createbutton" onClick={() => setNewAvatar(!newAvatar)}>
                        Change Avatar
                    </button>
                </div>
            </div>

            {newDesc && (
                <div className="post-setting">
                    <h3>Set your new description</h3>
                    <textarea ref={bioRef} defaultValue={user.user.bio}></textarea>
                    <button type="button" className="chatnav-createbutton" onClick={handleChangeDesc}>
                        Update
                    </button>
                </div>
            )}

            {newAvatar && (
                <div className="post-setting">
                    <h3>Set your new avatar</h3>
                    <form className="setting-form" onSubmit={uploadImage}>
                        <input type="file" name="avatar" id="avatar" onChange={onChangeImage} />
                        <button type="submit" className="chatnav-createbutton">
                            Update
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
