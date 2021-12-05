import React, { useState } from 'react';
import { updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { dbService } from 'fbase'; 

const Sweet = ({ sweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSweet, setNewSweet] = useState(sweetObj.text);

  // 삭제 버튼
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sre you want to delete this sweet?");
    // console.log(ok)
    if(ok) {
      // delete sweet
      await deleteDoc(doc(dbService, `sweets/${sweetObj.id}`))
    }
  }

  // 수정
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  }

  const handleOnChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSweet(value);
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    console.log(sweetObj, newSweet);
    await updateDoc(doc(dbService, `sweets/${sweetObj.id}`), {
      text: newSweet,
    })
    setEditing(false);
  }

  return (
    <div>
      {editing ?  (
        <>
          <form onSubmit={handleOnSubmit}>
            <input type="text" placeholder="Edit your name" value={newSweet} required onChange={handleOnChange} />
            <input type="submit" value="Update Sweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <h4>{sweetObj.text}</h4>
      )}
      {/* sweet을 쓴 주인만 삭제및수정버튼을 볼 수 있도록 합니다. */}
      {isOwner && (
        <>
          <button onClick={onDeleteClick}>Delete Sweet</button>
          <button onClick={toggleEditing}>Edit Sweet</button>
        </>
      )}
    </div>
  )
} 

export default Sweet;
  