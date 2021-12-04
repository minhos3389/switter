import { authService } from 'fbase';
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider  } from "firebase/auth";

// local 브라우저 닫아도 사용자로컬 유저 스토리지에저장
// session 브라우저 열려있느 상태에 유저 스토리지에 저장
// none 유저기억x 유저가 로그인하면 로그인은 시켜주지만, 페이지 새로고침하면 다시 로그인해야하게됨.


// export default () => <span>Auth</span>;
// 이렇게 해두면 자동 import 가 가능해집니다. const Auth = () => {return()}; export default Auth();
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    // console.log(event.target.name);
    // 변경이 일어난 부분
    const {target: {name, value}} = event;
    // console.log(value);  
    if (name === "email") {
      // input 은 value를 받아오지 letter를 추가해주진 않으므로, state에 value를 저장해주어야 함.
 
      setEmail(value);
    } else if(name === "password") {
      setPassword(value);
    }
  }
  const onSubmit = async(event) => {
    // 새로고침 방지. 기본행위가 실행되는 것을 방지 => 내자신이 컨트롤(핸들링) 가능하도록 함.
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // createAccount
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        // log in
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch(error) {
      // console.log(error.message);
      setError(error.message);
    }
  };
  const toggleAccout = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event) => {
    // console.log(event.target.name);
    const {
      target: { name }, 
    } = event;

    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if(name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
          name="email"
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={onChange}
        /> 
        <input 
          name="password"
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account": "Log In" } /> 
        {error}
      </form>
      <span onClick={toggleAccout}>{newAccount ? "Sign in" : "Create Account"}</span>
      <div>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
        <button onClick={onSocialClick} name="github">Continue with Github</button>
      </div>
    </div>
  )
}

export default Auth;