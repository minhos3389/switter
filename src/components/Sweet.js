import React, { useState } from 'react';
import { updateDoc, deleteDoc, doc } from '@firebase/firestore';
import { dbService } from 'fbase'; 

const Sweet = ({ sweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSweet, setNewSweet] = useState(sweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sre you want to delete this sweet?");
    // console.log(ok)
    if(ok) {
      // delete sweet
      await deleteDoc(doc(dbService, `sweets/${sweetObj.id}`))
    }
  }

  const toggleEditing = () => {
    setEditing((prevEditing) => !prevEditing);
  }

  const handleOnChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSweet(value);
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
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
  