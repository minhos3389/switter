import { authService } from 'fbase';
import React from 'react'
import { useNavigate } from 'react-router';

// export default () => <span>Profile</span>;
const Profile = () => {
  const navigator = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    // 로그인하고 나서 useNavigate hook으로 메인페이지(Home)으로 이동.
    navigator('/');
  }
  return(
    <button onClick={onLogOutClick}>Log Out</button>
  );
};

export default Profile;