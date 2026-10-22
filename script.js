// Starfield with golden shooting stars animation
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let shootingStars = [];

// Configuration
const STAR_COUNT = 250;
const SHOOTING_STAR_INTERVAL_MIN = 4000;
const SHOOTING_STAR_INTERVAL_MAX = 10000;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Static star class
class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.008 + 0.002;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        // Golden color variation
        const goldVariation = Math.random();
        if (goldVariation > 0.7) {
            // Warm golden stars
            this.color = { r: 212, g: 175, b: 55 };
        } else if (goldVariation > 0.4) {
            // Lighter gold
            this.color = { r: 230, g: 200, b: 100 };
        } else {
            // White-warm stars
            this.color = { r: 240, g: 235, b: 210 };
        }
    }

    draw(time) {
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.3 + 0.7;
        const alpha = this.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
        ctx.fill();

        // Add a golden glow to larger stars
        if (this.radius > 1.2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.15})`;
            ctx.fill();
        }
    }
}

// Shooting star class
class ShootingStar {
    constructor() {
        this.x = Math.random() * width * 0.7;
        this.y = Math.random() * height * 0.4;
        this.length = Math.random() * 80 + 60;
        this.speed = Math.random() * 8 + 6;
        this.angle = (Math.random() * 30 + 15) * (Math.PI / 180);
        this.opacity = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.radius = Math.random() * 1.5 + 1;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= this.decay;
    }

    draw() {
        if (this.opacity <= 0) return;

        // Draw the tail with golden gradient
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, `rgba(212, 175, 55, 0)`);
        gradient.addColorStop(1, `rgba(240, 220, 150, ${this.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.radius;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw the head
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 180, ${this.opacity})`;
        ctx.fill();

        // Golden glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.3})`;
        ctx.fill();
    }

    isDead() {
        return this.opacity <= 0;
    }
}

// Nebula class for subtle galaxy effect
class Nebula {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.6;
        this.radius = Math.random() * 150 + 80;
        this.opacity = Math.random() * 0.03 + 0.01;
        this.drift = (Math.random() - 0.5) * 0.1;
    }

    draw() {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `rgba(212, 175, 55, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(100, 120, 200, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

let nebulae = [];

function init() {
    resize();
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
    }
    nebulae = [];
    for (let i = 0; i < 3; i++) {
        nebulae.push(new Nebula());
    }
}

let lastShootingStarTime = 0;

function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw nebulae
    for (const nebula of nebulae) {
        nebula.x += nebula.drift;
        if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
        if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;
        nebula.draw();
    }

    // Draw static stars
    for (const star of stars) {
        star.draw(time);
    }

    // Spawn shooting stars randomly
    if (time - lastShootingStarTime > SHOOTING_STAR_INTERVAL_MIN + Math.random() * (SHOOTING_STAR_INTERVAL_MAX - SHOOTING_STAR_INTERVAL_MIN)) {
        shootingStars.push(new ShootingStar());
        lastShootingStarTime = time;
    }

    // Update and draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        shootingStars[i].update();
        shootingStars[i].draw();

        if (shootingStars[i].isDead()) {
            shootingStars.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('resize', () => {
    resize();
    init();
});

// Start animation
init();
requestAnimationFrame(animate);
