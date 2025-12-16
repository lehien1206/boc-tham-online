const socket = io(window.location.origin, {
  transports: ["websocket", "polling"]
});

let user = {};
let data = {};

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("update", d => {
  data = d;
  renderNumbers();
});

function join() {
  user.name = document.getElementById("name").value.trim();
  user.gender = document.getElementById("gender").value;

  if (!user.name) return alert("Hãy nhập tên");

  renderNumbers();
}

function renderNumbers() {
  if (!user.gender) return;

  const container = document.getElementById("numbers");

  let nums = user.gender === "male" ? data.male : data.female;
  let chosen = data.selected
      .filter(s => s.gender === user.gender)
      .map(s => s.number);

  container.innerHTML = "";

  nums.forEach(num => {
    const btn = document.createElement("div");
    btn.className = "number-btn";
    btn.textContent = num;

    if (chosen.includes(num)) {
      btn.classList.add("disabled");
    } else {
      btn.onclick = () => choose(num);
    }

    container.appendChild(btn);
  });
}

function choose(num) {
  socket.emit("choose-number", {
    name: user.name,
    gender: user.gender,
    number: num
  });
}
