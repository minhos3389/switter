import React, { useEffect, useState } from 'react'
import { dbService } from 'fbase';
import { collection, addDoc, serverTimestamp, getDocs } from '@firebase/firestore';

// export default () => <span>Home</span>;
const Home = ({ userObj }) => {
  const [sweet, setSweet] = useState("");
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    console.log(userObj);
    // firebase v9 문법
    const getSweets = async () => {
      const dbSweets = await getDocs(collection(dbService, 'sweets'));
      dbSweets.forEach((document) => {
        // console.log(document.data());
        const sweetObject = {
          // spread attribute 
          ...document.data(),
          id: document.id,
        }
        // console.log(sweetObject);
        // spread 연산자.
        // implicit return 배열을 리턴
        // 최신 document를 넣고, 이전 document 와 합쳐줌.
        setSweets((prev) => [sweetObject, ...prev])
      })
      // setSweets(dbSweets.map((document) => document.data()))
    }
    getSweets()
  }, [])
  
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    // firebase v9 문법
    // sweets 이라는 collection을 생성하고 
    const docRef = await addDoc(collection(dbService, 'sweets'), {
      // sweet 상태내용을 documents로 작성, 작성일자도 등록.
      text: sweet, 
      createAt: serverTimestamp(),
      creatorId: userObj.uid,
    })
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
        {sweets.map(sweet => (
          <div key={sweet.id}>
            <h4>{sweet.sweet}</h4>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Home;