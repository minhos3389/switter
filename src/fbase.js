// import * as firebase from "firebase/app";
import { initializeApp } from "@firebase/app";
import { getFirestore } from '@firebase/firestore';
// import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// firebase cloud firestore nosql database
// 제한사항이 존재. => NoSQL Collection 은 기본적으로 폴더, document는 문서로 이해.
// create-react-app을 만든 사람들에 의해서 
// REACT_APP으로 시작하는 환경변수를 찾도록 자동설정되어 있음.
// only for Github  (깃헙에 key를 올리지 않기 위함일 뿐.)
// firebase에 배포할때는 실제 키가 결국 변환되어 올라가게 되어 있음/ . 결국 사용자들에게 보이게 됨.
// 특정도메인에서만 이 key를 사용하는 등 다른 보안처리필요.
// .env 파일은 프로젝트 최상위루트에 존재해야함


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET, 
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// export default firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);

export const authService = getAuth(app);
export const dbService = getFirestore(app);
export const storage = getStorage(app);
