import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  }
});

let roomData = { male: [], female: [], selected: [] };

app.post("/init", (req, res) => {
  const { n, m } = req.body;

  const makePairs = x => {
    let arr = [];
    for (let i = 1; i <= x / 2; i++) arr.push(i, i);
    return arr;
  };

  roomData = {
    male: makePairs(n),
    female: makePairs(m),
    selected: []
  };

  io.emit("update", roomData);
  res.json(roomData);
});

app.get("/export", (req, res) => res.json(roomData.selected));

io.on("connection", socket => {
  socket.emit("update", roomData);

  socket.on("choose-number", data => {
    const existed = roomData.selected.find(
      x => x.gender === data.gender && x.number === data.number
    );
    if (existed) return;

    roomData.selected.push(data);
    io.emit("update", roomData);
  });
});

server.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
