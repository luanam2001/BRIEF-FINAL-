let waveResolution = 25; // Número de ondas
let baseRadius = 50; // Tamaño base del círculo
let amplitude = 15; // Amplitud de las ondas
let speed = 0.02;
let time = 0;
let resetButton;
let resetting = false;
let resetProgress = 0;
let bounce = 0;
let backgroundColor = 0;
let clickEffect = false; // Para la interacción de clic
let shapeChanged = false; // Determina si la forma ha cambiado
let waveExpansion = 0; // Controla la expansión de las ondas
let moveDirection = 1; // Dirección de movimiento para crear un efecto caótico
let particles = []; // Partículas aleatorias

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  
  resetButton = createButton('Reset');
  resetButton.position(20, 20);
  resetButton.mousePressed(startReset);
  resetButton.style('background-color', 'rgba(255, 255, 255, 0.2)');
  resetButton.style('border', 'none');
  resetButton.style('border-radius', '10px');
  resetButton.style('color', '#fff');
  resetButton.style('font-size', '20px');

  // Detectar clic del mouse para cambiar la forma
  canvas.addEventListener('click', changeShape);
}

function draw() {
  // Fondo cambia de color de manera animada durante el reset
  if (resetting) {
    backgroundColor = lerp(backgroundColor, 50, 0.05);
  } else {
    backgroundColor = lerp(backgroundColor, 0, 0.1);
  }
  background(backgroundColor);

  translate(width / 2, height / 2);

  // Si estamos en el proceso de reset, animamos el cambio de onda
  if (resetting) {
    resetProgress += 0.05; // Aumentar el progreso del reset
    if (resetProgress >= 1) {
      resetProgress = 1;
      resetting = false;
    }

    // Cambio gradual de tamaño y amplitud con un efecto de "rebote"
    baseRadius = lerp(50, 180 + bounce, resetProgress); // Expansión hasta un tamaño grande
    amplitude = lerp(15, 50, resetProgress); // Amplitud más grande
    time = lerp(0, PI * 2, resetProgress); // Reinicia el tiempo lentamente

    // Efecto de rebote: hace que la figura "rebote" cuando reinicia
    bounce = sin(resetProgress * PI) * 10; 
  }

  // Efecto de explosión al hacer clic
  if (clickEffect) {
    // Animación de expansión rápida
    waveExpansion = lerp(waveExpansion, 1.5, 0.1); // Se expande cuando hace clic
    if (waveExpansion > 1.4) {
      clickEffect = false; // Finaliza la explosión
    }
  } else {
    // Efecto de ondas que se expanden y contraen
    waveExpansion = lerp(waveExpansion, 1, 0.05);
  }

  // Crear un movimiento más loco en las ondas: Movimiento aleatorio
  let chaosFactor = sin(time * 0.1) * 50; // Distorsión más caótica

  // Dibujar las ondas con el radio dinámico y colores vibrantes
  for (let i = 0; i < waveResolution; i++) {
    let radius = map(i, 0, waveResolution, baseRadius, min(width, height) / 5) * waveExpansion;
    let chaos = sin(time + i) * chaosFactor; // Distorsión por onda
    drawWaveCircle(radius + chaos, i);
  }

  // Generar partículas aleatorias al azar
  generateRandomParticles();

  time += speed;

  // Movimiento "loco" de la figura (caótico y dinámico)
  if (moveDirection > 0) {
    translate(sin(time * 0.5) * 100, cos(time * 0.5) * 100); // Movimiento aleatorio
  } else {
    translate(sin(time * 0.7) * 200, cos(time * 0.7) * 200); // Movimiento más amplio y errático
  }

  // Hacer que el botón se vea como si fuera presionado
  if (resetting) {
    resetButton.style('transform', 'scale(0.9)');
  } else {
    resetButton.style('transform', 'scale(1)');
  }

  // Cambiar la dirección de movimiento en intervalos
  if (frameCount % 180 === 0) {
    moveDirection *= -1; // Cambiar dirección cada 3 segundos
  }
}

// Función para dibujar un círculo de ondas con resplandor dinámico y colores vibrantes
function drawWaveCircle(radius, index) {
  // Usar una paleta de colores vibrantes que cambian dinámicamente con el índice
  let r = random(128, 255); // Rojo aleatorio
  let g = random(128, 255); // Verde aleatorio
  let b = random(128, 255); // Azul aleatorio
  
  // Aplicar colores brillantes y gradientes
  let alpha = map(index, 0, waveResolution, 200, 100); // Opacidad para dar un efecto de resplandor
  stroke(r, g, b, alpha); 

  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.15) {
    let freq = angle * 5 + time * 2;
    let distortion = sin(time + angle * 3) * 5;

    // Si la forma ha cambiado, aplicamos una distorsión diferente
    if (shapeChanged) {
      distortion = random(-30, 30); // Deformación aleatoria
    }

    let x = (radius + sin(freq) * amplitude + distortion) * cos(angle);
    let y = (radius + sin(freq) * amplitude + distortion) * sin(angle);
    
    vertex(x, y);
  }
  endShape(CLOSE);
}

// Función para generar partículas aleatorias
function generateRandomParticles() {
  if (random(1) < 0.2) { // Probabilidad de generar partículas al azar
    let p = createVector(0, 0);
    p.x = random(-width / 2, width / 2);
    p.y = random(-height / 2, height / 2);
    particles.push(p);
  }

  // Dibujar partículas
  for (let p of particles) {
    let size = random(5, 15); // Tamaño aleatorio de la partícula
    stroke(random(255), random(255), random(255), 150); // Colores aleatorios
    point(p.x, p.y);
    p.x += random(-5, 5); // Movimiento aleatorio de partículas
    p.y += random(-5, 5);
  }
}

// Función para iniciar el proceso de reinicio
function startReset() {
  resetting = true;
  resetProgress = 0;
  bounce = 0;
  clickEffect = true; // Activar el efecto de clic
  shapeChanged = false; // Vuelve a la forma original
  resetButton.style('transform', 'scale(0.9)'); // Efecto de botón presionado
}

// Función para cambiar la forma de la figura al hacer clic en el canvas
function changeShape() {
  shapeChanged = !shapeChanged; // Cambiar la forma entre normal y distorsionada
}





