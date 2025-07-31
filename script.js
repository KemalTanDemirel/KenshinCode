// KenshinCode - Polybius Cipher JavaScript

class PolybiusCipher {
    constructor() {
        // 7x7 Polybius karesi - Türkçe karakterler + ek karakterler
        this.polybiusSquare = [
            ['A', 'B', 'C', 'Ç', 'D', 'E', 'F'],
            ['G', 'Ğ', 'H', 'I', 'İ', 'J', 'K'],
            ['L', 'M', 'N', 'O', 'Ö', 'P', 'Q'],
            ['R', 'S', 'Ş', 'T', 'U', 'Ü', 'V'],
            ['W', 'X', 'Y', 'Z', '.', ',', '?'],
            ['0', '1', '2', '3', '4', '5', '6'],
            ['7', '8', '9', ' ', '-', '_', '!']
        ];

        this.charToCoord = {};
        this.coordToChar = {};
        this.operationHistory = [];
        this.instructionsVisible = true;

        this.init();
    }

    init() {
        this.initializeTables();
        this.displayPolybiusGrid();
        this.setupEventListeners();
        this.updateStats('', 0);
        this.updateCharCounter();
        
        // Hoş geldin mesajı
        setTimeout(() => {
            this.showNotification('KenshinCode\'a hoş geldiniz! 🎉', 'success', 4000);
        }, 1000);
    }

    initializeTables() {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                const char = this.polybiusSquare[row][col];
                const coord = `${row + 1}${col + 1}`;
                this.charToCoord[char] = coord;
                this.coordToChar[coord] = char;
            }
        }
    }

    displayPolybiusGrid() {
        const grid = document.getElementById('polybiusGrid');
        
        // Başlık satırı
        grid.innerHTML = '<div class="grid-cell grid-header"></div>';
        for (let i = 1; i <= 7; i++) {
            grid.innerHTML += `<div class="grid-cell grid-header">${i}</div>`;
        }

        // Veri satırları
        for (let row = 0; row < 7; row++) {
            grid.innerHTML += `<div class="grid-cell grid-header">${row + 1}</div>`;
            for (let col = 0; col < 7; col++) {
                const char = this.polybiusSquare[row][col];
                const coord = `${row + 1}${col + 1}`;
                grid.innerHTML += `<div class="grid-cell" data-char="${char}" data-coord="${coord}" onclick="cipher.highlightCell('${char}')">${char}</div>`;
            }
        }
    }

    highlightCell(char) {
        // Önceki vurguları temizle
        document.querySelectorAll('.grid-cell.highlight').forEach(cell => {
            cell.classList.remove('highlight');
        });

        // Yeni hücreyi vurgula
        const cell = document.querySelector(`[data-char="${char}"]`);
        if (cell) {
            cell.classList.add('highlight');
            const coord = this.charToCoord[char];
            this.showNotification(`${char} → ${coord}`, 'info');
            
            setTimeout(() => {
                cell.classList.remove('highlight');
            }, 2000);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }

    updateStats(text, operationTime = 0) {
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const encryptedCount = this.operationHistory.length;
        
        document.getElementById('charCount').textContent = charCount;
        document.getElementById('wordCount').textContent = wordCount;
        document.getElementById('encryptedCount').textContent = encryptedCount;
        document.getElementById('operationTime').textContent = operationTime + 'ms';
        
        // Progress bar animasyonu
        const progressFill = document.getElementById('progressFill');
        const progress = Math.min((charCount / 100) * 100, 100);
        progressFill.style.width = progress + '%';
    }

    updateCharCounter() {
        const input = document.getElementById('inputText');
        const counter = document.getElementById('charCounter');
        const length = input.value.length;
        
        counter.textContent = `${length} karakter`;
    }

    encryptText() {
        const startTime = performance.now();
        const input = document.getElementById('inputText').value.toUpperCase();
        const output = document.getElementById('output');
        const encryptBtn = document.getElementById('encryptBtn');
        
        if (!input.trim()) {
            output.textContent = 'Lütfen şifrelenecek bir metin girin.';
            output.className = 'output error';
            this.showNotification('Metin girişi boş!', 'error');
            return;
        }

        // Button loading state
        encryptBtn.classList.add('button-loading');
        encryptBtn.disabled = true;

        setTimeout(() => {
            let encrypted = [];
            let unknownChars = [];

            for (let char of input) {
                if (this.charToCoord[char]) {
                    encrypted.push(this.charToCoord[char]);
                } else {
                    unknownChars.push(char);
                }
            }

            const endTime = performance.now();
            const operationTime = Math.round(endTime - startTime);

            if (unknownChars.length > 0) {
                const result = `Şifreleme tamamlandı, ancak şu karakterler desteklenmiyor: ${[...new Set(unknownChars)].join(', ')}\n\nŞifreli metin:\n${encrypted.join(' ')}`;
                output.textContent = result;
                output.className = 'output error';
                this.showNotification('Bazı karakterler desteklenmiyor!', 'warning');
            } else {
                output.textContent = encrypted.join(' ');
                output.className = 'output success';
                this.showNotification('Şifreleme başarılı!', 'success');
            }

            // İşlem geçmişine ekle
            this.operationHistory.push({
                type: 'encrypt',
                input: input,
                output: encrypted.join(' '),
                time: new Date().toLocaleTimeString(),
                duration: operationTime
            });

            this.updateStats(input, operationTime);
            
            // Button normal state
            encryptBtn.classList.remove('button-loading');
            encryptBtn.disabled = false;
        }, 200); // Kısa gecikme
    }

    decryptText() {
        const startTime = performance.now();
        const input = document.getElementById('inputText').value.trim();
        const output = document.getElementById('output');
        const decryptBtn = document.getElementById('decryptBtn');
        
        if (!input) {
            output.textContent = 'Lütfen çözülecek sayıları girin.';
            output.className = 'output error';
            this.showNotification('Sayı girişi boş!', 'error');
            return;
        }

        // Button loading state
        decryptBtn.classList.add('button-loading');
        decryptBtn.disabled = true;

        setTimeout(() => {
            // Sayıları ayır (boşluk, tire veya virgül ile)
            const numbers = input.split(/[\s\-,]+/).filter(n => n.length > 0);
            let decrypted = [];
            let invalidNumbers = [];

            for (let num of numbers) {
                if (num.length === 2 && /^\d{2}$/.test(num)) {
                    if (this.coordToChar[num]) {
                        decrypted.push(this.coordToChar[num]);
                    } else {
                        invalidNumbers.push(num);
                    }
                } else {
                    invalidNumbers.push(num);
                }
            }

            const endTime = performance.now();
            const operationTime = Math.round(endTime - startTime);

            if (invalidNumbers.length > 0) {
                const result = `Çözümleme tamamlandı, ancak şu sayılar geçersiz: ${invalidNumbers.join(', ')}\n\nÇözümlenmiş metin:\n${decrypted.join('')}`;
                output.textContent = result;
                output.className = 'output error';
                this.showNotification('Bazı sayılar geçersiz!', 'warning');
            } else {
                output.textContent = decrypted.join('');
                output.className = 'output success';
                this.showNotification('Deşifreleme başarılı!', 'success');
            }

            // İşlem geçmişine ekle
            this.operationHistory.push({
                type: 'decrypt',
                input: input,
                output: decrypted.join(''),
                time: new Date().toLocaleTimeString(),
                duration: operationTime
            });

            this.updateStats(decrypted.join(''), operationTime);
            
            // Button normal state
            decryptBtn.classList.remove('button-loading');
            decryptBtn.disabled = false;
        }, 200);
    }

    copyToClipboard() {
        const output = document.getElementById('output');
        const text = output.textContent;
        
        if (text === 'Sonuç burada görünecek...') {
            this.showNotification('Kopyalanacak içerik yok!', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Panoya kopyalandı!', 'success');
            
            // Copy button animasyonu
            const copyBtn = document.getElementById('copyBtn');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Kopyala';
            }, 2000);
        }).catch(() => {
            this.showNotification('Kopyalama başarısız!', 'error');
        });
    }

    toggleInstructions() {
        const content = document.getElementById('instructionsContent');
        const icon = document.getElementById('instructionIcon');
        
        this.instructionsVisible = !this.instructionsVisible;
        
        if (this.instructionsVisible) {
            content.classList.remove('collapsed');
            icon.className = 'fas fa-chevron-down';
        } else {
            content.classList.add('collapsed');
            icon.className = 'fas fa-chevron-right';
        }
    }

    clearAll() {
        const input = document.getElementById('inputText');
        const output = document.getElementById('output');
        const progressFill = document.getElementById('progressFill');
        
        input.value = '';
        output.textContent = 'Sonuç burada görünecek...';
        output.className = 'output';
        progressFill.style.width = '0%';
        
        this.updateStats('', 0);
        this.updateCharCounter();
        
        this.showNotification('Tüm alanlar temizlendi!', 'info');
    }

    setupEventListeners() {
        const inputText = document.getElementById('inputText');
        let typingTimer = null;
        let isTyping = false;
        
        // Karakter sayacı ve typing indicator
        inputText.addEventListener('input', () => {
            isTyping = true;
            this.updateCharCounter();
            this.updateStats(inputText.value);
            
            const indicator = document.getElementById('typingIndicator');
            indicator.classList.add('active');
            
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                isTyping = false;
                indicator.classList.remove('active');
            }, 1000);
        });

        // Klavye kısayolları
        inputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                this.encryptText();
            } else if (e.key === 'Enter' && e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                this.decryptText();
            } else if (e.key === 'Escape') {
                this.clearAll();
            }
        });

        // Grid hücre hover efektleri
        setTimeout(() => {
            const gridCells = document.querySelectorAll('.grid-cell:not(.grid-header)');
            gridCells.forEach(cell => {
                cell.addEventListener('mouseenter', function() {
                    const char = this.dataset.char;
                    const coord = this.dataset.coord;
                    if (char && coord) {
                        this.title = `${char} → ${coord}`;
                    }
                });
            });
        }, 100);

    }
}

// Global cipher instance
let cipher;

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    cipher = new PolybiusCipher();
});

// Global functions for HTML onclick events
function encryptText() {
    cipher.encryptText();
}

function decryptText() {
    cipher.decryptText();
}

function copyToClipboard() {
    cipher.copyToClipboard();
}

function toggleInstructions() {
    cipher.toggleInstructions();
}

function clearAll() {
    cipher.clearAll();
}
