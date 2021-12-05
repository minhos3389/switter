import React, { useEffect, useState } from 'react'
import { dbService } from 'fbase';
// 실시간 트윗(스윗) query, onSnapshot, orderBy 사용
// 이전 구현된 것은 새로고침을 해야 db 의 정보를 가져와 업데이트. 
// 하지만 firestore db 는 realtimedb이기 때문에 이점을 살리기 위해 리얼타임으로 구현.
import { collection, addDoc, serverTimestamp, getDocs, query, onSnapshot, orderBy,limit } from '@firebase/firestore';
import { storageService } from 'fbase';
import Sweet from 'components/Sweet';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';

// export default () => <span>Home</span>;
// App에서 Router로 보낸 userObj를 Router에서 또 Home으로 보내줌.
const Home = ({ userObj }) => { 
  const [progress, setProgress] = useState(0);
  const [sweet, setSweet] = useState("");
  const [sweets, setSweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  // useEffect(() => {
  //   console.log(userObj);
  //   // firebase v9 문법
  //   const getSweets = async () => {
  //     const dbSweets = await getDocs(collection(dbService, 'sweets'));
  //     dbSweets.forEach((document) => {
  //       // console.log(document.data());
  //       const sweetObject = {
  //         // spread attribute 
  //         ...document.data(),
  //         id: document.id,
  //       }
  //       // console.log(sweetObject);
  //       // spread 연산자.
  //       // implicit return 배열을 리턴
  //       // 최신 document를 넣고, 이전 document 와 합쳐줌.
  //       setSweets((prev) => [sweetObject, ...prev])
  //     })
  //     // setSweets(dbSweets.map((document) => document.data()))
  //   }
  //   getSweets()
  // }, [])

  useEffect(() => {
    // 실시간으로 데이터베이스에서 데이터 가져오도록 수정.
    const sweetsRef = collection(dbService, "sweets");
    // 이거알아내라 고생함. 
    const q = query(sweetsRef, orderBy('createAt', 'desc'), limit(10));
    // console.log('q:', q);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // onSnapshot() 메서드로 문서를 수신 대기할 수 있습니다. 사용자가 제공하는 콜백이 최초로 호출될 떄 단일 문서의 
      // 현재 콘텐츠로 문서 스냅샷이 즉시 생성됩니다. 그런 다음 콘텐츠가 변경될 때마다 콜백이 호출되어 문서 스냅샷을 업데이트합니다.
      // onSnapshot()은 기본적으로 데이터베이스에 무슨일이 있을때 , 알림을 받습니다.
      // collection("sweet")을 사용중.
      // console.log('쿼리스냅샷.',querySnapshot);
      // setSweets로 array만들어서 map 돌리는게 re-render 도 안일어나고 foreach 보다 더좋다. 한번만 일어남 useEffect사용
      const sweetArray = querySnapshot.docs.map((doc) => {
        return {
          // doc의 id와 doc의 데이터를 합쳐서 반환.
          id: doc.id,
          ...doc.data(),
        }
      })
      console.log('sweetArray', sweetArray);
      setSweets(sweetArray);
    })

    return () => {
      unsubscribe();
    }
  }, []);
  
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    // 먼저 사진이 있다면 사진을 올리고 url을 받아서 sweet에 넣고 파일 url을 가진 sweet 생성.
    // firebase v9 문법
    // sweets 이라는 collection을 생성하고 
  //   const docRef = await addDoc(collection(dbService, 'sweets'), {
  //     // sweet 상태내용을 documents로 작성, 작성일자도 등록.
  //     text: sweet, 
  //     createAt: serverTimestamp(),
  //     creatorId: userObj.uid,
  //   });

  //   console.log('Document written with ID: ', docRef.id)

  //   // 다시 초기화
  //   setSweet('');
  };

  // uploadFiles(file ) 
  // https://www.youtube.com/watch?v=pJ8LykeBDo4  
  const uploadFiles = (file) => {
    // 
    if(!file) return;
    const storageRef = ref(storageService, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const prog = Math.round( 
        (snapshot.bytesTransferred / snapshot.totalBytes ) * 100
      );

      setProgress(prog);
    }, 
    (error) => console.log(error),
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then(url => console.log(url)); 
    }
    );
  };

  
  const handleOnChange = (event) => {
    const {
       target: { value },
    } = event;
    setSweet(value);
  };

  // console.log(sweets);
  const onFileChange = (event) => {
    const { 
      target: { files },
    } = event;
    // 여러개의 파일을 가질 수 있지만 , 우리의 input은 하나의 파일만 받도록 되어있음.
    // 그래서 input에 있는 모든 파일 중에 첫번째 파일만 받도록 설정.
    const theFile = files[0];
    const reader = new FileReader();
    // 파일 로딩이 끝났을때 이벤트 읽어오는 부분
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const { 
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    } 
    // 데이터를 url로 읽어오는 부분
    reader.readAsDataURL(theFile);

    // console.log(theFile);
    // fileReader API는 말 그대로 파일 이름을 읽는 것.
  }
  const onClearAttachment = () => setAttachment(null);
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input 
          value={sweet}
          onChange={handleOnChange}
          type="text" 
          placeholder="What's on your mind?"
          maxLength={120} 
        /> 
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <h3>Uploaded {progress} %</h3>
        <input 
          type="submit"
          value="Sweet" 
        />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt=""/> 
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {sweets.map((sweet) => (
          // sweetObj는 전체 Object  id 와 데이터.
          // sweetObj와 isOwner를 prop으로 가집니다.
          // sweet을 만든 사람(sweet.creatorId)과 userObj.uid가 같으면 true입니다.
          <Sweet 
            key={sweet.id} 
            sweetObj={sweet}
            isOwner={sweet.creatorId === userObj.uid}  
          />
        ))}
      </div>
    </div>
  )
};

export default Home;