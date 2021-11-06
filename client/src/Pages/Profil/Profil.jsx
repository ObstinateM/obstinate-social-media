// React
import React from 'react';

// Hooks
import { useModal } from 'Hook/useModal';

// Components
import { CreatePost } from 'Components/CreatePost/CreatePost';
import { UserFeed } from 'Components/Profil/Profil';

export function ProfilPage() {
    const { isShowing, toggle } = useModal();

    return (
        <>
            <CreatePost isShowing={isShowing} toggle={toggle} />
            <button className="create-button" onClick={toggle}>
                <img src="http://localhost:3000/images/writing.png" alt="Create new" />
            </button>
            <UserFeed />
        </>
    );
}
