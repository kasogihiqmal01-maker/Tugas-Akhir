let hasil = "";
let preview = "";
let history = JSON.parse(localStorage.getItem('history')) || [];

const expressionEl = document.getElementById('expression');
const previewEl = document.getElementById('preview');
const historyListEl = document.getElementById('historyList');
const hapusAllBtn = document.getElementById('hapusAll');

// Custom functions for degrees
function degSin(deg) {
    return Math.sin(deg * Math.PI / 180);
}

function degCos(deg) {
    return Math.cos(deg * Math.PI / 180);
}

function degTan(deg) {
    return Math.tan(deg * Math.PI / 180);
}

// Function to convert decimal to fraction
function toFraction(num) {
    if (Math.abs(num) < 1e-10) return "0";
    if (Math.abs(num - 1) < 1e-10) return "1";
    if (Math.abs(num + 1) < 1e-10) return "-1";
    if (Math.abs(num - 0.5) < 1e-10) return "1/2";
    if (Math.abs(num + 0.5) < 1e-10) return "-1/2";
    if (Math.abs(num - Math.sqrt(2)/2) < 1e-10) return "√2/2";
    if (Math.abs(num + Math.sqrt(2)/2) < 1e-10) return "-√2/2";
    if (Math.abs(num - Math.sqrt(3)/2) < 1e-10) return "√3/2";
    if (Math.abs(num + Math.sqrt(3)/2) < 1e-10) return "-√3/2";
    if (Math.abs(num - Math.sqrt(3)/3) < 1e-10) return "√3/3";
    if (Math.abs(num + Math.sqrt(3)/3) < 1e-10) return "-√3/3";
    if (Math.abs(num - 1/3) < 1e-10) return "1/3";
    if (Math.abs(num + 1/3) < 1e-10) return "-1/3";
    if (Math.abs(num - 2/3) < 1e-10) return "2/3";
    if (Math.abs(num + 2/3) < 1e-10) return "-2/3";
    if (Math.abs(num - 1/Math.sqrt(2)) < 1e-10) return "1/√2";
    if (Math.abs(num + 1/Math.sqrt(2)) < 1e-10) return "-1/√2";
    if (Math.abs(num - 1/Math.sqrt(3)) < 1e-10) return "1/√3";
    if (Math.abs(num + 1/Math.sqrt(3)) < 1e-10) return "-1/√3";
    // For other cases, return decimal
    return num.toString();
}

function isValidExpression(str) {
    let openParen = 0;
    let inFunction = false;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') openParen++;
        if (str[i] === ')') openParen--;
        if (openParen < 0) return false;
        if (str.substr(i, 7) === 'degSin(' || str.substr(i, 7) === 'degCos(' || str.substr(i, 7) === 'degTan(' || str.substr(i, 11) === 'Math.log10(' || str.substr(i, 9) === 'Math.log(' || str.substr(i, 10) === 'Math.sqrt(') inFunction = true;
        if (inFunction && str[i] === ')') inFunction = false;
    }
    return openParen === 0 && !inFunction;
}

function updateDisplay() {
    expressionEl.textContent = hasil
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/degSin\(/g, 'sin(')
        .replace(/degCos\(/g, 'cos(')
        .replace(/degTan\(/g, 'tan(')
        .replace(/Math\.log10\(/g, 'log(')
        .replace(/Math\.log\(/g, 'ln(')
        .replace(/Math\.sqrt\(/g, '√(')
        .replace(/\*\*/g, '^')
        .replace(/Math\.PI/g, 'π');
    previewEl.textContent = (preview !== "" && hasil !== "") ? "= " + preview : "";
    // Set color for error messages or non-numeric results
    if (hasil === "Error" || hasil === "Tak Terdefinisi" || preview === "Tak Terdefinisi") {
        expressionEl.style.color = "red";
        previewEl.style.color = "red";
    } else {
        expressionEl.style.color = "var(--text-layar)";
        previewEl.style.color = "var(--preview-color)";
    }
    // Set cursor to the end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(expressionEl);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    updateButtonStates();
}

function updateButtonStates() {
    // No need to update button states since prevention is handled in handleButton
}

expressionEl.addEventListener("input", () => {
    hasil = expressionEl.textContent
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/sin\(/g, 'degSin(')
        .replace(/cos\(/g, 'degCos(')
        .replace(/tan\(/g, 'degTan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI');
    calculatePreview();
    updateButtonStates();
});

expressionEl.addEventListener("keypress", (e) => {
    const allowed = "0123456789+-*/().";
    if (!allowed.includes(e.key)) e.preventDefault();
});

function calculatePreview() {
    if (hasil !== "" && /[0-9)\s]$/.test(hasil)) {
        let evalStr = hasil
            .replace(/sin\(/g, 'degSin(')
            .replace(/cos\(/g, 'degCos(')
            .replace(/tan\(/g, 'degTan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI');
        if (isValidExpression(evalStr)) {
            try {
                preview = eval(evalStr);
                if (preview === Infinity) preview = "Tak Terdefinisi";
                else preview = toFraction(preview);
            } catch {
                preview = "";
            }
        } else {
            preview = "";
        }
    } else {
        preview = "";
    }
    updateDisplay();
}

function handleButton(value) {
    if (value === "C") {
        hasil = "";
        preview = "";
        expressionEl.textContent = "";
    }
    else if (value === "DEL") {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (range.startOffset > 0) {
                range.setStart(range.startContainer, range.startOffset - 1);
                range.deleteContents();
                hasil = expressionEl.textContent
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/sin\(/g, 'degSin(')
                    .replace(/cos\(/g, 'degCos(')
                    .replace(/tan\(/g, 'degTan(')
                    .replace(/log\(/g, 'Math.log10(')
                    .replace(/ln\(/g, 'Math.log(')
                    .replace(/√\(/g, 'Math.sqrt(')
                    .replace(/\^/g, '**')
                    .replace(/π/g, 'Math.PI');
            }
        }
    }
    else if (value === "=") {
        let evalStr = hasil
            .replace(/sin\(/g, 'degSin(')
            .replace(/cos\(/g, 'degCos(')
            .replace(/tan\(/g, 'degTan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI');
        if (isValidExpression(evalStr)) {
            try {
                const result = eval(evalStr);
                if (result === Infinity) result = "Tak Terdefinisi";
                const resultFraction = result === "Tak Terdefinisi" ? result : toFraction(result);
                const riwayat = hasil
                    .replace(/\*/g, '×')
                    .replace(/\//g, '÷')
                    .replace(/degSin\(/g, 'sin(')
                    .replace(/degCos\(/g, 'cos(')
                    .replace(/degTan\(/g, 'tan(')
                    .replace(/Math\.log10\(/g, 'log(')
                    .replace(/Math\.log\(/g, 'ln(')
                    .replace(/Math\.sqrt\(/g, '√(')
                    .replace(/\*\*/g, '^')
                    .replace(/Math\.PI/g, 'π') + " = " + resultFraction;
                history.push(riwayat);
                localStorage.setItem('history', JSON.stringify(history));
                hasil = resultFraction.toString();
                preview = "";
                renderHistory();
            } catch {
                hasil = "Tak Terdefinisi";
                preview = "";
            }
        } else {
            hasil = "Error";
            preview = "";
        }
    }
    else {
        const operators = ['+', '-', '*', '/'];
        if (operators.includes(value)) {
            const lastChar = hasil.slice(-1);
            const endsWithDigit = /\d/.test(lastChar);
            if (!endsWithDigit) {
                return; // Do not insert the operator
            }
        }
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(value));
            hasil = expressionEl.textContent
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/sin\(/g, 'degSin(')
                .replace(/cos\(/g, 'degCos(')
                .replace(/tan\(/g, 'degTan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/√\(/g, 'Math.sqrt(')
                .replace(/\^/g, '**')
                .replace(/π/g, 'Math.PI');
        }
    }

    calculatePreview();
}

document.querySelectorAll('.tombol-container button, .fx-container button').forEach(btn => {
    btn.addEventListener('click', () => handleButton(btn.getAttribute('data-value')));
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleButton("="); e.stopPropagation(); }
    if (e.key === "Backspace") {
        e.preventDefault();
        if (hasil.length > 0) {
            hasil = hasil.slice(0, -1);
            updateDisplay();
            calculatePreview();
        }
        e.stopPropagation();
    }
    if (e.key === "Escape") { handleButton("C"); e.stopPropagation(); }
    if (e.key.toLowerCase() === "c") { e.preventDefault(); handleButton("C"); e.stopPropagation(); }
    if (e.key === "Delete") { e.preventDefault(); handleButton("C"); e.stopPropagation(); }

    if (e.key === "ArrowUp") {
        document.body.classList.add("light");
        localStorage.setItem("themeMode", "light");
        e.stopPropagation();
    }
    if (e.key === "ArrowDown") {
        document.body.classList.remove("light");
        localStorage.setItem("themeMode", "dark");
        e.stopPropagation();
    }
});

function renderHistory() {
    historyListEl.innerHTML = '';

    if (history.length === 0) {
        historyListEl.innerHTML = '<p style="text-align:center; color:#bbb;">Belum ada riwayat</p>';
        hapusAllBtn.style.display = 'none';
    } else {
        history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `${item} <button class="hapus-btn" data-index="${index}">X</button>`;
            historyListEl.appendChild(div);
        });
        hapusAllBtn.style.display = 'block';
    }
}

historyListEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('hapus-btn')) {
        const index = e.target.getAttribute('data-index');
        history.splice(index, 1);
        localStorage.setItem('history', JSON.stringify(history));
        renderHistory();
    }
});

hapusAllBtn.addEventListener('click', () => {
    history = [];
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
});

const range = document.getElementById('kontrasRange');
const persenText = document.getElementById('persenText');

range.addEventListener('input', () => {
    const persen = range.value;
    persenText.textContent = persen + '%';
    const bright = 0.5 + (persen / 100) * 1.3;
    document.documentElement.style.setProperty('--brightness-level', bright);
    localStorage.setItem('brightnessPercent', persen);
});

const savedPercent = localStorage.getItem('brightnessPercent');
if (savedPercent) {
    range.value = savedPercent;
    persenText.textContent = savedPercent + '%';
    const bright = 0.5 + (savedPercent / 100) * 1.3;
    document.documentElement.style.setProperty('--brightness-level', bright);
}

const theme = localStorage.getItem('themeMode');
if (theme === 'light') document.body.classList.add('light');

const toggleThemeBtn = document.getElementById('toggleTheme');
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('themeMode', isLight ? 'light' : 'dark');
});

renderHistory();
updateDisplay();