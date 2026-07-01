const changeCharBtn = document.getElementById('change-char-btn');
const characters = ['mario.png', 'Luigi.png', 'kitty.png', 'snoopy.png'];
let charIndex = 0; 

document.body.style.setProperty('--char-bg', `url(${characters[charIndex]})`);

changeCharBtn.addEventListener('click', () => {
    charIndex = (charIndex + 1) % characters.length; 
    document.body.style.setProperty('--char-bg', `url(${characters[charIndex]})`);
});

const coins = document.querySelectorAll('coin');
const heartCounter = document.getElementById('heart-counter');
const loveMessage = document.getElementById('love-message');
const flowerImage = document.getElementById('flower-image');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

let score = 0;

const finalMessages = ["TE AMO", "MY LOVE", "AMOR DE MI VIDA"];
let currentMessageIndex = 0;
let messageLoopInterval;

let pointDistribution = [1, 3, 3, 3, 3, 1];
pointDistribution.sort(() => Math.random() - 0.5); 

let coinValues = {};
coins.forEach((coin, index) => {
    let p = parseInt(coin.getAttribute('p'));
    coinValues[p] = pointDistribution[index];
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let lastScrollY = window.scrollY;
let canHit = true; 

window.addEventListener('scroll', () => {
    let currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY + 2 && canHit) {
        checkHit();
        canHit = false;
        setTimeout(() => { canHit = true; }, 400); 
    }
    lastScrollY = currentScrollY;
});

function checkHit() {
    let maxScroll = document.body.scrollWidth - window.innerWidth;
    if (maxScroll <= 0) return;

    let x0 = window.scrollX / maxScroll;
    let marioX = x0 * (window.innerWidth - 50);
    let currentIndex = Math.round(marioX / 50);

    coins.forEach(coin => {
        let p = parseInt(coin.getAttribute('p'));
        if (p === currentIndex && coinValues[p] > 0) {
            coinValues[p]--; 
            score++;         
            
            if (coinValues[p] === 0) {
                setTimeout(() => {
                    coin.classList.add('collected');
                }, 800); 
            }
            updateGameInfo();
        }
    });
}

function updateGameInfo() {
    heartCounter.innerHTML = "Corazones: " + score;

    if (score >= 5 && score < 10) {
        flowerImage.classList.add('show');
        loveMessage.innerHTML = "PARA TI PRECIOSA";
        loveMessage.classList.add('show');
    } else if (score >= 10) {
        flowerImage.classList.remove('show');
        loveMessage.classList.add('show', 'final');
        startFireworks();
        startMessageLoop(); 
    }
}

function startMessageLoop() {
    if (messageLoopInterval) return; 

    loveMessage.innerHTML = finalMessages[currentMessageIndex];
    
    messageLoopInterval = setInterval(() => {
        currentMessageIndex = (currentMessageIndex + 1) % finalMessages.length;
        loveMessage.innerHTML = finalMessages[currentMessageIndex];
    }, 3000); 
}

let particles = [];
let fireworksInterval;

function startFireworks() {
    if (fireworksInterval) return;
    
    fireworksInterval = setInterval(() => {
        let margin = canvas.width * 0.2; 
        let minX = margin;
        let maxX = canvas.width - margin;
        
        let x = minX + Math.random() * (maxX - minX);
        let y = Math.random() * (canvas.height / 2);
        createExplosion(x, y);
    }, 800);
    
    requestAnimationFrame(animateFireworks);
}

function createExplosion(x, y) {
    const colors = ['#ff0044', '#ff66aa', '#ffffff', '#ffaa00', '#d81b60'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            life: 1,
            color: color
        });
    }
}

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.015;
        
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        if (p.life <= 0) particles.splice(index, 1);
    });
    
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateFireworks);
}