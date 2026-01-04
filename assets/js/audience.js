const bc = new BroadcastChannel('sere_stream');
const tmDisplay = document.getElementById('timerDisp');

bc.onmessage = (msg) => {
    const data = msg.data;

    // Update Angka Timer
    tmDisplay.innerText = data.time;

    // Logika Blink saat Pause atau Time Up
    if (data.status === 'PAUSED' || data.status === 'TIME UP') {
        tmDisplay.classList.add('blink');
    } else {
        tmDisplay.classList.remove('blink');
    }

    // Logika Warna
    if (data.status === 'STANDBY') {
        tmDisplay.style.color = '#ffff00'; // Kuning
    } else if (data.status === 'TIME UP') {
        tmDisplay.style.color = '#ff0000'; // Merah
    } else {
        tmDisplay.style.color = '#ffffff'; // Putih
    }
};