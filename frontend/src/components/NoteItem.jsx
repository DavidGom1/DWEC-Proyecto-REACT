function NoteItem({ note, onToggle, onDelete }) {
    return(
        <>
            <div className={`note-item ${note.completed ? 'completed' : ''}`}>
                <div className="note-content">
                    <input
                        type="checkbox"
                        checked={note.completed}
                        onChange={() => onToggle(note.id)}
                        className="note-checkbox"
                    />
                    <span className="note-text">{note.text}</span>
                </div>
                <button
                    onClick={() => onDelete(note.id)}
                    className="delete-button"
                    >
                        Eliminar
                    </button>

            </div>
        </>
    )
}

export default NoteItem;