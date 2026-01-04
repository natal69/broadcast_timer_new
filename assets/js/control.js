import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  https://broadcast-timer-default-rtdb.asia-southeast1.firebasedatabase.app/
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function broadcast(status, time) {
    const data = {
        ev: document.getElementById('evName').value,
        curr: document.getElementById('currSess').value,
        next: document.getElementById('nextSess').value,
        time: time || document.getElementById('timer-display').innerText,
        status: status,
        timestamp: Date.now() // Penting agar penerima tahu ada update baru
    };
    
    // Kirim data ke Firebase di path "timer_data"
    set(ref(db, 'timer_data'), data);
    
    document.getElementById('curStatus').innerText = status;
}

const bc = new BroadcastChannel("sere_stream");
let interval,
  totalSecs = 0;

//End

// Checklist Logic
const checks = document.querySelectorAll(".chk");
const continueBtn = document.getElementById("continueBtn");
checks.forEach((c) =>
  c.addEventListener("change", () => {
    const allChecked = Array.from(checks).every((i) => i.checked);
    continueBtn.disabled = !allChecked;
    continueBtn.innerText = allChecked
      ? "Continue"
      : "Please complete all items";
    continueBtn.classList.toggle("active", allChecked);
  })
);

continueBtn.onclick = () =>
  (document.getElementById("overlay").style.display = "none");

function broadcast(status, time) {
  bc.postMessage({
    ev: document.getElementById("evName").value,
    curr: document.getElementById("currSess").value,
    next: document.getElementById("nextSess").value,
    time: time || document.getElementById("timer-display").innerText,
    status: status,
  });
  document.getElementById("curStatus").innerText = status;
}

document.getElementById("btnStandby").onclick = () => {
  clearInterval(interval);
  broadcast("STANDBY");
};

document.getElementById("btnStart").onclick = () => {
  if (totalSecs <= 0)
    totalSecs = parseInt(document.getElementById("timerIn").value) * 60;
  clearInterval(interval);
  interval = setInterval(() => {
    if (totalSecs <= 0) {
      clearInterval(interval);
      broadcast("TIME UP", "00:00");
      return;
    }
    totalSecs--;
    const ts = `${Math.floor(totalSecs / 60)
      .toString()
      .padStart(2, "0")}:${(totalSecs % 60).toString().padStart(2, "0")}`;
    document.getElementById("timer-display").innerText = ts;
    broadcast("GO", ts);
  }, 1000);
};

document.getElementById("btnPause").onclick = () => {
  clearInterval(interval);
  broadcast("PAUSED");
};

document.getElementById("btnReset").onclick = () => {
  clearInterval(interval);
  totalSecs = 0;
  document
    .querySelectorAll("input")
    .forEach((i) => (i.value = i.type === "number" ? 0 : ""));
  document.getElementById("timer-display").innerText = "00:00";
  broadcast("RESET", "00:00");
};
