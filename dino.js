const board = {
  height: 250,
  width: 750,
  element: "board",
};

const player = {
  width: 88,
  height: 94,
  x: 50,
};

const obstacle = {
  height: 70,
  x: 700,
};

const obstacleItemList = [
  { img: "./img/cactus3.png", width: 102, occur: 10 },
  { img: "./img/cactus2.png", width: 69, occur: 20 },
  { img: "./img/cactus1.png", width: 34, occur: 100 },
];

window.onload = () =>
  new Game()
    .buildAsset("./img/dino.png", "./img/dino-dead.png")
    .buildBoard(board)
    .buildPlayer(player)
    .buildObstacle(obstacle, obstacleItemList)

class Game {
  velocityY = 0;
  velocityX = -10;
  gravity = 0.4;
  obstacleList = [];
  gameOver = false;

  constructor() {
    requestAnimationFrame(this.update.bind(this));
    document.addEventListener("keydown", this.move.bind(this));
    setInterval(this.placeItem.bind(this), 1000);
  }

  static createImage(url) {
    let img = new Image();
    img.src = url;
    return img;
  }

  buildGravity(gravity) {
    this.gravity = gravity;
    return this;
  }

  buildAsset(playerImg, deadImg) {
    this.playerImg = Game.createImage(playerImg);
    this.deadImg = deadImg;
    this.playerImg.onload = () =>
      this.context.drawImage(
        this.playerImg,
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
      );

    return this;
  }

  buildBoard(boardProps) {
    this.board = document.getElementById(boardProps.element);
    this.board.height = boardProps.height;
    this.board.width = boardProps.width;
    this.context = this.board.getContext("2d");
    return this;
  }
  buildPlayer(player) {
    this.playerX = player.x;
    this.playerY = this.board.height - player.height;
    this.player = {
      x: this.playerX,
      y: this.playerY,
      width: player.width,
      height: player.height,
    };
    return this;
  }
  buildObstacle(obstacle, obstacleItemList) {
    this.obstacle = obstacle;
    this.obstacle.y = this.board.height - obstacle.height;
    this.obstacleItemList = obstacleItemList;
    return this;
  }

  move(e) {
    if (
      (e.code == "Space" || e.code == "ArrowUp") &&
      this.player.y == this.playerY
    ) {
      this.velocityY = -10;
    }
  }

  update() {
    if (this.gameOver) return;
    requestAnimationFrame(this.update.bind(this));
    this.context.clearRect(0, 0, this.board.width, this.board.height);
    this.velocityY += this.gravity;
    this.player.y = Math.min(this.player.y + this.velocityY, this.playerY);
    this.context.drawImage(
      this.playerImg,
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    //cactus
    for (let i = 0; i < this.obstacleList.length; i++) {
      let newObstacle = this.obstacleList[i];
      newObstacle.x += this.velocityX;
      this.context.drawImage(
        newObstacle.img,
        newObstacle.x,
        newObstacle.y,
        newObstacle.width,
        newObstacle.height
      );

      if (this.detectCollision(this.player, newObstacle)) {
        this.gameOver = true;
        this.playerImg.src = this.deadImg;
        this.playerImg.onload = () =>
          this.context.drawImage(
            this.playerImg,
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
          );
      }
    }
  }

  placeItem() {
    const random = Math.random();
    const item = this.obstacleItemList.find(
      (item) => item.occur > random * 100
    );
    let newObstacle = {
      x: this.obstacle.x,
      y: this.obstacle.y,
      height: this.obstacle.height,
      ...item,
    };
    newObstacle.img = Game.createImage(item.img);

    this.obstacleList.push(newObstacle);
    if (this.obstacleList.length > 5) {
      this.obstacleList.shift();
    }
  }

  detectCollision(a, b) {
    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
