import React, { useState, useRef } from "react";

export default function TaskManager({ tasks, onAdd, onDelete, onReorder, onClose }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMinutes, setNewMinutes] = useState("");
  const modalRef = useRef(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setEditName(tasks[idx].label);
    setEditMinutes(Math.round(tasks[idx].duration / 60));
  };

  const handleEditSave = (idx) => {
    if (editName && editMinutes) {
      tasks[idx].label = editName;
      tasks[idx].duration = parseInt(editMinutes) * 60;
      setEditingIndex(null);
    }
  };

  const handleAddTask = () => {
    if (newName && newMinutes) {
      onAdd({ label: newName, duration: parseInt(newMinutes) * 60 });
      setNewName("");
      setNewMinutes("");
      setShowAdd(false);
    }
  };

  // Only allow drag from handle
  const handleDragStart = (e, index) => {
    if (e.target.classList.contains('task-drag-handle')) {
      setDraggedTask(index);
      e.dataTransfer.effectAllowed = 'move';
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    setDragOverIdx(idx);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedTask !== null && draggedTask !== targetIndex) {
      onReorder(draggedTask, targetIndex);
    }
    setDraggedTask(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverIdx(null);
  };

  const validateMinutes = (value) => {
    // Only allow positive numbers
    const num = parseInt(value);
    if (isNaN(num) || num <= 0) return "";
    return num.toString();
  };

  return (
    <div
      ref={modalRef}
      style={{
        width: 380,
        maxWidth: "100%",
      }}
    >
      <div className="modal-header">
        <span style={{ fontWeight: 700, fontSize: 20, fontFamily: "Inter, sans-serif", color: "#fff" }}>
          Tasks
        </span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#fff" }}
        >
          &times;
        </button>
      </div>
      <div className="modal-content">
        {tasks.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "20px", 
            color: "#888",
            fontFamily: "Inter, sans-serif",
            fontSize: 16
          }}>
            Add task and time to get started
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tasks.map((task, idx) => (
              <React.Fragment key={idx}>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 0,
                    background: dragOverIdx === idx ? "#222" : "inherit",
                    opacity: draggedTask === idx ? 0.5 : 1,
                    borderBottom: idx !== tasks.length - 1 ? "1px solid #444" : undefined,
                  }}
                  draggable={false}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                >
                  
                  <span
                    className="task-drag-handle"
                    style={{
                      cursor: "grab",
                      userSelect: "none",
                      fontSize: 20,
                      color: "#888",
                      marginRight: 10,
                      marginLeft: 15,
                      display: "flex",
                      alignItems: "center"
                    }}
                    title="Drag to reorder"
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                  >
                    &#8942;&#8942;
                  </span>
                  {editingIndex === idx ? (
                    <>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          padding: "4px 8px",
                          marginRight: 8,
                          flex: 1,
                          background: "#333",
                          color: "#fff"
                        }}
                      />
                      <input
                        type="number"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(validateMinutes(e.target.value))}
                        style={{
                          width: 60,
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          padding: "4px 8px",
                          marginRight: 8,
                          background: "#333",
                          color: "#fff"
                        }}
                      />
                      <button
                        onClick={() => handleEditSave(idx)}
                        style={{
                          borderRadius: 6,
                          border: "none",
                          background: "#222",
                          color: "#fff",
                          padding: "4px 12px",
                          marginRight: 4,
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        style={{
                          borderRadius: 6,
                          border: "none",
                          background: "#eee",
                          color: "#222",
                          padding: "4px 12px",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          flex: 1,
                          fontFamily: "Inter, sans-serif",
                          fontSize: 16,
                          color: "#fff",
                          marginLeft: 15,
                          padding: 10,
                        }}
                      >
                        {task.label}
                      </span>
                      <span
                        style={{
                          width: 50,
                          textAlign: "right",
                          color: "#888",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 15,
                        }}
                      >
                        {Math.round(task.duration / 60)} min
                      </span>
                      <button
                        onClick={() => handleEdit(idx)}
                        style={{
                          marginLeft: 8,
                          border: "none",
                          background: "none",
                          color: "#888",
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => onDelete(idx)}
                        style={{
                          marginLeft: 4,
                          marginRight: 15,
                          border: "none",
                          background: "none",
                          color: "rgba(249, 93, 93, 1)",
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                        title="Delete task"
                      >
                        &times;
                      </button>
                    </>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ul>
        )}
        {showAdd ? (
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column"}}>
            <input
              placeholder="Task name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                fontFamily: "Inter, sans-serif",
                borderRadius: 8,
                border: "1px solid #b8b8b8ff",
                padding: "8px 12px",
                fontSize: 16,
                background: "#333",
                color: "#fff",
                boxSizing: "border-box",
                width: "95%", 
                margin: "0 0 8px 8px"
               
              }}
            />
            <input
              type="number"
              placeholder="Minutes"
              value={newMinutes}
              onChange={(e) => setNewMinutes(validateMinutes(e.target.value))}
              style={{
                fontFamily: "Inter, sans-serif",
                borderRadius: 8,
                border: "1px solid #b8b8b8ff",
                padding: "8px 12px",
                fontSize: 16,
                background: "#333",
                color: "#fff",
                boxSizing: "border-box",
                width: "95%",
                margin: "0 0 8px 8px"
              }}
            />
            <div style={{ display: "flex" }}>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  borderRadius: 8,
                  border: "none",
                  background: "#eee",
                  color: "#222",
                  padding: "8px 18px",
                  fontWeight: 600,
                  margin: "0 0 8px 8px"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                style={{
                  borderRadius: 8,
                  border: "none",
                  background: "#0f0f0fff",
                  color: "#fff",
                  padding: "8px 18px",
                  fontWeight: 600,
                  margin: "0 0 8px 8px"
                  
                }}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            style={{
              marginTop: 24,
              width: "100%",
              border: "1px solid #222",
              background: "linear-gradient(180deg, #000000 0%,rgb(31, 31, 31) 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              padding: "10px 0",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
}
