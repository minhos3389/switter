import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
// import fbase from "fbase";
import { authService } from "fbase";


// fbase에서 firebase로 import 하는 것과 겹치면 안되므로 firebase.js => fbase.js 로 변경해줌.
// jsconfig.json 파일에서 모든 파일들이 src로 부터 시작한다는 것을 명시해서 위의 두가지 절대경로를 사용할 수 있게됨.
// https://create-react-app.dev/docs/importing-a-component/ cra에서의 absolute import 

function App() {
  // const auth = fbase.auth();
  // console.log(authService.currentUser); // null (로그인하지 않은 경우 null)
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // 이를통해서 유저의로그인 여부를 알 수 있습니다.
  // user가 누구인지 알려주는 상태
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    // 사용자의 로그인 상태의 변화를 관찰자를 추가. 
    // eventlistener 역할 
    // 유저상태에 변화가 있을때 그것을 알아챔 로그아웃할때 발생, 계정생성할때 발생, firebase 초기화, 로그인할때 발생
    authService.onAuthStateChanged((user) => {
      if(user) {
        // setIsLoggedIn(true);
        // user가 바뀌면 이곳에 넣어줌. (user 정보를 넣어서 관리.)
        setUserObj(user);
      } else {
        // setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  console.log(authService.currentUser);
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);
  return (
    <>
      {/* isLoggedIn에 props로 isLoggedIn 넣지않고 userObj를 propr로 넣어줘도 됨. (불리언형태로 넣으면 동일) */}
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
      {/* <footer>&copy; {new Date().getFullYear()} Switter</footer> */}
    </>
  );
}

export default App;
