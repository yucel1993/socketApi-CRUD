const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let crudData = [];

io.on("connection", (socket) => {
  socket.on("data", (data) => {
    crudData.push(data);
    socket.emit("crudData", crudData); //! sending to the client
    console.log(crudData);
  });

  socket.on("editData", (response) => {
    let currentIndex = crudData.findIndex((data) => data.id === response.id);
    if (currentIndex !== -1) {
      crudData[currentIndex] = { ...crudData[currentIndex], ...response };
    }
  });

  socket.on("deleteData", (id) => {
    let currentIndex = crudData.findIndex((data) => data.id === id);
    if (currentIndex !== -1) {
      crudData.splice(currentIndex, 1);
    }
  });

  setInterval(() => {
    socket.emit("crudData", crudData); //! sending to the client
  }, 5000);
});

//   setInterval(() => {
//     socket.emit("playerScores", playerScores);
//   }, 5000);
// });

httpServer.listen(3000, () => {
  console.log("Server is running!");
});
