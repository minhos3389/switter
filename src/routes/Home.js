import React, { useEffect, useState } from 'react'
import { dbService } from 'fbase';
// 실시간 트윗(스윗) query, onSnapshot, orderBy 사용
// 이전 구현된 것은 새로고침을 해야 db 의 정보를 가져와 업데이트. 
// 하지만 firestore db 는 realtimedb이기 때문에 이점을 살리기 위해 리얼타임으로 구현.
import { collection, addDoc, serverTimestamp, getDocs, query, onSnapshot, orderBy,limit } from '@firebase/firestore';
import Sweet from 'components/Sweet';

// export default () => <span>Home</span>;
const Home = ({ userObj }) => {
  const [sweet, setSweet] = useState("");
  const [sweets, setSweets] = useState([]);

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
    console.log('q:', q);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('쿼리스냅샷.',querySnapshot);
      // setSweets로 array만들어서 map 돌리는게 re-render 도 안일어나고 foreach 보다 더좋다. 한번만 일어남 useEffect사용
      const sweetArray = querySnapshot.docs.map((doc) => {
        console.log('doc', doc);
        return {
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
    // firebase v9 문법
    // sweets 이라는 collection을 생성하고 
    const docRef = await addDoc(collection(dbService, 'sweets'), {
      // sweet 상태내용을 documents로 작성, 작성일자도 등록.
      text: sweet, 
      createAt: serverTimestamp(),
      creatorId: userObj.uid,
    });

    console.log('Document written with ID: ', docRef.id)

    // 다시 초기화
    setSweet('');
  };

  
  const handleOnChange = (event) => {
    const {
       target: { value },
    } = event;
    setSweet(value);
  };

  // console.log(sweets);

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
        <input 
          type="submit"
          value="Sweet" 
        />
      </form>
      <div>
        {sweets.map((sweet) => (
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