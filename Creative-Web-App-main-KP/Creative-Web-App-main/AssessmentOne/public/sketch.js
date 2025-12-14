let notes = [];
let message = "NOTE TAKING";
let colors = ["#FFF59D", "#FFAB91", "#81D4FA", "#C5E1A5", "#F8BBD0", "#FFD54F"];

function setup() {
  let canvas = createCanvas(800, 300);
  canvas.parent("noteAnimation");

  textAlign(CENTER, CENTER);
  textSize(34); // slightly smaller text
  noStroke();

  let xStart = 60; // moved left so whole word fits

  for (let i = 0; i < message.length; i++) {
    let letter = message[i];
    if (letter === " ") {
      xStart += 35;
      continue;
    }

    notes.push({
      letter,
      x: random(width),
      y: random(-500, -50),
      targetX: xStart,
      targetY: 150,
      speed: random(0.01, 0.01),
      color: random(colors),
    });

    xStart += 70; // tighter spacing so full word fits
  }
}

function draw() {
  background("#F4F6FB");

  for (let n of notes) {
    n.y = lerp(n.y, n.targetY, n.speed);
    n.x = lerp(n.x, n.targetX, n.speed);

    // Sticky note shadow
    fill(0, 50);
    rect(n.x + 6, n.y + 6, 85, 85, 12);

    // Sticky note
    fill(n.color);
    rect(n.x, n.y, 85, 85, 12);

    // Letter
    fill(20);
    text(n.letter, n.x + 42, n.y + 42);
  }
}
