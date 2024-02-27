import React, { useState } from "react";
import NoteContext from "./noteContext";
const NoteState=(props)=>
{
  const host="http://localhost:5000"
    const notesInitial=[]
      const [notes, setnotes] = useState(notesInitial)

      //Get all note
      const getNotes=async ()=>{
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token':localStorage.getItem('token')
          }
        });
        const json=await response.json();
        // console.log(json);
        setnotes(json);
        }


      //Add a note
      // TODO:API CALL
      const addNote=async (title,description,tag)=>{
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token':localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}) 
      });
        const note= await response.json();
        setnotes(notes.concat(note));
          
      }
      //Delete a note
      // TODO:API CALL
      const deleteNote=async(id)=>{
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token':localStorage.getItem('token')
          }
        });
        const json=response.json();
        // console.log(json);
        const newNotes=notes.filter((note)=>{return note._id!==id})
        setnotes(newNotes);
      }
      //Edit a note
      const editNote=async (id,title,description,tag)=>{
        //Api call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token':localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag}) 
        });
        const json= await response.json(); 
        // console.log(json);
        
        let newNotes = JSON.parse(JSON.stringify(notes))
        //Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id)
          {
            newNotes[index].title=title;
            newNotes[index].description=description;
            newNotes[index].tag=tag;
            break;
          }
        }
        setnotes(newNotes);
      }

    return(
        <NoteContext.Provider value={{notes, addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;


// import React, { useState } from "react";
// import NoteContext from "./noteContext";
// const NoteState=(props)=>
// {
//     const s1={
//         "name":"Harry",
//         "class":"5b"
//     }
//     const [state, setstate] = useState(s1);
//     const update=()=>
//     {
//         setTimeout(() => {
//             setstate({
//                 "name":"Larry",
//                 "class":"10b"
//             })
//         }, 1000);
//     }
//     return(
//         <NoteContext.Provider value={{state,update}}>
//             {props.children}
//         </NoteContext.Provider>
//     )
// }

// export default NoteState;