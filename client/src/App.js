import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import castleBackground from "./images/disney-castle.jpg";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState({
    name: "",
    franchise: "",
    yearRelease: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    const res = await axios.get(`${API}/characters`);
    setCharacters(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/characters/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(`${API}/characters`, form);
    }
    setForm({ name: "", franchise: "", yearRelease: "" });
    fetchCharacters();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/characters/${id}`);
    fetchCharacters();
  };

  const handleEdit = (char) => {
    setForm(char);
    setEditId(char._id);
  };

  return (
    <div
  className="app"
  style={{
    backgroundImage: `url(${castleBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <h1>My Disney Favorites</h1> 

  <form onSubmit={handleSubmit}>
    <input
      name="name"
      placeholder="Name"
      value={form.name}
      onChange={handleChange}
      required
    />
    <input
      name="franchise"
      placeholder="Franchise"
      value={form.franchise}
      onChange={handleChange}
    />
    <input
      name="yearRelease"
      placeholder="Year Release"
      value={form.yearRelease}
      onChange={handleChange}
    />
    <button type="submit">{editId ? "Update" : "Add"} Character</button>
  </form>

  {/* Scrollable character list */}
  <div className="character-list">
    <ul>
      {characters.map((char) => (
        <li key={char._id} className="character-card">
          <div className="character-info">
            <strong>{char.name}</strong> – {char.franchise} ({char.yearRelease})
          </div>
          <div className="button-group">
            <button onClick={() => handleEdit(char)}>Edit</button>
            <button onClick={() => handleDelete(char._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>
  );
}

export default App;
