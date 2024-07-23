import React, {useContext} from 'react'
import NoteContext from '../context/notes/noteContext'


const Noteitem = (props) => {
    const context = useContext(NoteContext)
    const { deleteNote } = context
    const { note, editNote } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <h5 className="card-title">{note.title}</h5>
                        <div>
                            <i className="fa-solid fa-pen-to-square mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>{editNote(note)}}></i>
                            <i className="fa-solid fa-trash"onClick={()=>{deleteNote(note._id)
                                 props.showAlert('Deleted successfully', 'success')}}></i>
                        </div>
                    </div>
                    <p className="card-text">{note.description} </p>
                </div>
            </div>
        </div>
    )
}

export default Noteitem