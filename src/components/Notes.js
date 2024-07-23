import React, { useContext, useEffect, useState } from 'react'
import NoteContext from '../context/notes/noteContext'
import Noteitem from './Noteitem'
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const context = useContext(NoteContext)
  const { notes, fetchAllNotes, updateNote } = context
  const navigate = useNavigate()
  useEffect(() => {
    if(localStorage.getItem('token')){
      fetchAllNotes()
    }else{
      navigate('/login')
    }
    //eslint-disable-next-line
  }, [])

  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

  const handleUpdateNote = (e) => {
    e.preventDefault()
    updateNote(note.id, note.etitle, note.edescription, note.etag)
    props.showAlert('updated successfully', 'success')
  }
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const editNote = (currentNote) => {
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
  }


  return (
    <>
      <AddNote showAlert={props.showAlert} />

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">tag</label>
                  <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdateNote}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container">
          {notes.length === 0 && 'No Notes to dislpay'}
        </div>
        {notes.map((note) => {
          return <Noteitem key={note._id} note={note} editNote={editNote} showAlert={props.showAlert} />
        })}
      </div>
    </>
  )
}

export default Notes