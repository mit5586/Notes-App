import React, {useState} from 'react';
import NoteContext from './noteContext';

const NotesState = (props)=>{
    const host = "http://localhost:5000"
    const initialNotes = []
    const [notes, setNotes] = useState(initialNotes)


    //fetch all notes
    const fetchAllNotes = async()=>{
        const response = await fetch(`${host}/api/notes/fetchallnotes`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'auth-token': localStorage.getItem('token')
            }
        })
        const json = await response.json()
        setNotes(json)
    }

    // add a note 
    const addNote = async(title, description, tag)=>{
        //TODO: api call
        const response = await fetch(`${host}/api/notes/addnote`,{
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        })
        const json = await response.json()
        setNotes(notes.concat(json));
    }
    // delete a note 
    const deleteNote = async(id)=>{
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'auth-token': localStorage.getItem('token')
            }
        })
        response.json()
        const newNotes = notes.filter((note)=>{return note._id !== id})
        setNotes(newNotes)
    }
    // edit a note 
    const updateNote = async(id, title, description, tag)=>{
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': "application/json",
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        })
        await response.json()
        
        let newNote = JSON.parse(JSON.stringify(notes))

        for (let i = 0; i < newNote.length; i++) {
            // const element = newNote[i];
            if(newNote[i]._id === id){
                newNote[i].title = title; 
                newNote[i].description = description; 
                newNote[i].tag = tag; 
                break;
            }
            
        }
        setNotes(newNote)
    }

    return(
        <NoteContext.Provider value={{notes, addNote,deleteNote,updateNote,fetchAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NotesState