let message = "WELCOME TO THE FOCUSHUB";
let currentText = "";
let index = 0;
let typingSpeed = 10; // lower = faster
let frameCounter = 0;
let cursorVisible = true;

function setup() {
  let canvas = createCanvas(600, 200);
  canvas.parent("p5-typing"); // attach canvas to div
  textFont("Georgia");
  textSize(36);
  textAlign(CENTER, CENTER);
}

function draw() {
  background("white");

  frameCounter++;

  if (frameCounter % typingSpeed === 0 && index < message.length) {
    currentText += message[index];
    index++;
  }

  if (frameCounter % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  fill(30);
  text(currentText, width / 2, height / 2);

  if (cursorVisible && index < message.length + 1) {
    let textWidthSoFar = textWidth(currentText);
    line(
      width / 2 + textWidthSoFar / 2 + 5,
      height / 2 - 18,
      width / 2 + textWidthSoFar / 2 + 5,
      height / 2 + 18
    );
  }
}
