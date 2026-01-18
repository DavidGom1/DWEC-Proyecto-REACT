import { useState } from 'react'
import NoteItem from './components/NoteItem'
import './App.css'

function App() {
  const [notes, setNotes] = useState([
    { id: 1, text: "Nota de ejemplo 1", completed: false },
    { id: 2, text: "Nota de ejemplo 2", completed: false },
  ])

  const [newNote, setNewNote] = useState("");

  const addNote = (e) => {
    e.preventDefault();
    let newNoteText = newNote.trim();
    if(newNoteText){
      setNotes([
        ...notes,
        {
          id: Date.now(),
          text: newNote,
          completed: false
        }
      ]);
      setNewNote("");
    }
  }

  const toogleNote = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    )
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  }


  return (
    <>
      <div className='app'>
        <div className='container'>
          <h1>Mis notas</h1>
          <form onSubmit={addNote}>
            <input type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className='note-input'
            />
            <button type='submit' className='add-button'>
              Añadir nota
            </button>
          </form>
          <div className='notes-list'>
            {notes.length == 0 ? (
              <p className='no-notes'>No se encontraton notas</p>
            ) : (
              notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onToggle={toogleNote}
                  onDelete={deleteNote}
                />
              ))
            )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
