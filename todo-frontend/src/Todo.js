import { useState, useEffect } from "react";
import './index.css';

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    // Edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setTitle("")
                    setDescription("")
                    setMessage("Item Added Successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    setError("Unable to Create ToDo Item");
                }
            }).catch(() => {
                setError("Unable to Create ToDo Item");
            });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });

                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item Updated Successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);

                    setEditId(-1);
                } else {
                    setError("Unable to Update ToDo Item");
                }
            }).catch(() => {
                setError("Unable to Update ToDo Item");
            });
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    }

    const handleDelete = (id) =>{
        if(window.confirm("Are You Sure want to Delete ?")){
            fetch(apiUrl+'/todos/'+id, {
                method: "DELETE"
            })
            .then(()=>{
                const updatedTodos = todos.filter((item) => item._id !== id)
                setTodos(updatedTodos)
            })
        }
    }

    const handleKeyDown = (e) =>{
        if (e.key === 'Enter'){
            handleSubmit(e);
        }
    };

    return (
        <>
            <div className="container">
                <div className="row-1">
                    <h1>To-Do List</h1>
                </div>

                <div className="row-2">
                    <h3 className="add-item">Add Item</h3>
                    {message && <p className="text-success">{message}</p>}

                    <div className="form-group">
                        <input placeholder="Title" className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={handleKeyDown}  />
                        <input placeholder="Description" className="form-control" type="text" value={description} onChange={(e) => setDescription(e.target.value)} onKeyDown={handleKeyDown} />
                        <button className="btn" onClick={handleSubmit}>Submit</button>
                    </div>
                    {error && <p className="text-error">{error}</p>}
                </div>

                <div className="row-3">
                    <h3>Tasks</h3>
                    <ul className="list-group">
                        {
                            todos.map((item, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="content">
                                        {editId === -1 || editId !== item._id ? (
                                            <>
                                                <span className="task-title">{item.title}</span>
                                                <span className="task-desc">{item.description}</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <input placeholder="Title" className="form-control" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                                    <input placeholder="Description" className="form-control" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="btns">
                                        {editId === -1 || editId !== item._id ? (
                                            <button onClick={() => handleEdit(item)}>Edit</button>
                                        ) : (
                                            <button onClick={handleUpdate}>Update</button>
                                        )}
                                        {editId === -1 ? (
                                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                                        ) : (
                                            <button onClick={handleEditCancel}>Cancel</button>
                                        )}
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}
