import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import EditProfile from "routes/EditProfile";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
// react-router-dom v6 부터 Switch => Routes로 변경

const AppRouter =  ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Routes>
        { 
          isLoggedIn 
          ? 
          <>
            {/* 해당하는 Route 경로를 제외하고는 다른 url로 접근시에 / 로 이동하게 됩니다. */}
            <Route path="/" element={<Home userObj={userObj}/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editprofile" element={<EditProfile />} /> 
            <Route path="*" element={<Navigate to="/" />} />
          </>
          :
          <>  
            <Route path="/" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        }
      </Routes>
    </Router>
  )
}

export default AppRouter;