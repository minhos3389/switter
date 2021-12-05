import { authService } from 'fbase';
import { signOut } from '@firebase/auth';
import React from 'react'
import { useNavigate } from 'react-router';

// export default () => <span>Profile</span>;
const Profile = () => {
  const navigator = useNavigate();
  const handleLogOutClick = async () => {
    signOut(authService).then(() => {
      // 로그인하고 나서 useNavigate hook으로 메인페이지(Home)으로 이동.
    navigator('/');
    // 페이지로 이동하고 새로고침하지않으면 로그아웃된 화면으로 전환이 되지않는 문제가 발생해서 이렇게 리로드하는 함수를 사용.
    window.location.reload();
    // 또는 이렇게도 가능. => 해당페이지로 이동
    // window.location.replace("/");
    }).catch((error) => {
      console.log(error);
    });
    
  }
  return(
    <button onClick={handleLogOutClick}>Log Out</button>
  );
};

export default Profile;