let board;
let boardHeight = 250;
let boardWidth = 750;

let dinoWidth = 88;
let dinoHeight = 94;

let dinoX = 50;
let dinoY = boardHeight - dinoHeight;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

let velocityY = 0;
let dinoImg;
let context;
let gravity = 0.4;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  dinoImg = new Image();
  dinoImg.src = "./img/dino.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDino);
};

function moveDino(e) {
  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    velocityY = -10;
  }
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);
  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}
