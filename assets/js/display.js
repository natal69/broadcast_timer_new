const bc = new BroadcastChannel('sere_stream');

const evDisplay = document.getElementById('evNameDisp');
const currDisplay = document.getElementById('currDisp');
const tmDisplay = document.getElementById('timerDisp');
const nextDisplay = document.getElementById('nextDisp');

bc.onmessage = (msg) => {
    const data = msg.data;

    // Update Nama Event
    evDisplay.innerText = data.ev || "EVENT NAME";

    // Update Sesi Saat Ini & Efek Standby
    if (data.status === 'STANDBY') {
        currDisplay.innerText = "STANDBY";
        currDisplay.classList.add('blink');
        tmDisplay.style.color = '#ffff00'; // Kuning saat standby
    } else {
        currDisplay.innerText = data.curr || "-";
        currDisplay.classList.remove('blink');
        tmDisplay.style.color = '#ffffff'; // Kembali putih
    }

    // Update Sesi Berikutnya
    nextDisplay.innerText = data.next || "-";

    // Update Angka Timer
    tmDisplay.innerText = data.time;

    // Logika Animasi (Blink) untuk Pause & Time Up
    if (data.status === 'PAUSED' || data.status === 'TIME UP') {
        tmDisplay.classList.add('blink');
    } else {
        tmDisplay.classList.remove('blink');
    }

    // Warna Merah Jika Waktu Habis
    if (data.status === 'TIME UP') {
        tmDisplay.style.color = '#ff0000';
    }
};