import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [formInputs, setFormInputs] = useState([]);
  const [crudData, setCrudData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const socket = io("localhost:3000");
  const handleInput = (event) => {
    const { name, value } = event.target;

    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    const id = new Date().getTime();
    socket.emit("data", { ...formInputs, id }); //! Here sending the data to the socketio
    setFormInputs({ name: "", age: "", phone: "" });
  };
  const getEditData = (data) => {
    setIsEdit(true);
    setFormInputs(data);
  };
  const handleEdit = () => {
    console.log(formInputs);
    socket.emit("editData", formInputs);
    setIsEdit(false);
    setFormInputs({ name: "", age: "", phone: "" });
  };

  const handleDelete = (item) => {
    socket.emit("deleteData", item.id);
    console.log(item.id);
  };
  useEffect(() => {
    socket.on("crudData", (data) => {
      console.log(data);
      setCrudData(data);
    });
  }, []);

  return (
    <>
      <h1>React Crud Operations with SocketIo</h1>
      <div className="form-input">
        <input
          name="name"
          placeholder="Enter your Name"
          className="input-field"
          onChange={handleInput}
          value={formInputs.name}
        />

        <input
          name="age"
          placeholder="Enter your Age"
          className="input-field"
          onChange={handleInput}
          value={formInputs.age}
        />
        <input
          name="phone"
          placeholder="Enter your Phone Number"
          className="input-field"
          onChange={handleInput}
          value={formInputs.phone}
        />

        <button
          className="send-scores"
          onClick={isEdit ? handleEdit : handleSubmit}
        >
          {isEdit ? "Edit Data" : "Publish Data"}
        </button>
        <div>
          <table>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Action</th>
              <th>Action</th>
            </tr>
            {crudData.length > 0 &&
              crudData.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.phone}</td>
                  <td>
                    <button onClick={() => getEditData(item)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(item)}>Delete</button>
                  </td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    </>
  );
}

export default App;

// const [score, setScores] = useState({});
// const [scores, setAllScores] = useState([]);
// const socket = io("localhost:3000");

// function connectSocket() {
//   socket.on("connection", (socket) => {
//     console.log(socket);
//   });
// }

// function handleInput(event) {
//   let { name, value } = event.target;
//   let currentObj = { [name]: value };

//   setScores((prev) => ({ ...prev, ...currentObj }));
// }

// function sendScores() {
//   socket.emit("scores", score);

//   socket.on("playerScores", (playerScores) => {
//     setAllScores(playerScores);
//   });
// }

// useEffect(() => {
//   connectSocket();
// }, []);
