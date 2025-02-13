import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { stringAvatar } from "../functions/stringAvatar";
import http from '../http';  // Assuming http is set up to handle API requests

function ProfilePicture(props) {
    const { user } = props;
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

    // Set the profile photo URL when user data is available
    useEffect(() => {
        if (user.profile_photo_file_path) {
            // The profile photo URL is directly available, prepend the base URL if necessary
            const fullUrl = `${user.profile_photo_file_path}`;
            setProfilePhotoUrl(fullUrl);
        }
    }, [user]);  // This will run whenever the user changes

    const name = user.username || "User";
    const s = {
        ...stringAvatar(name).sx,
        ...props.sx
    };

    return (
        <>
            {profilePhotoUrl ? (
                <Avatar {...props} src={profilePhotoUrl} />
            ) : (
                <Avatar {...stringAvatar(name)} sx={s} />
            )}
        </>
    );
}

export default ProfilePicture;
