// window.onload = () => new Game("./img/dino.png", "./img/dino-dead.png");
window.onload = () =>
  new Game(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShTqCHlRmun5QqSr-8ayx1kGg3mbiCBCM4d_v6vQOBlePi4z79hci6K_6Hz6Vfe0trIiI&usqp=CAUhttps://art.pixilart.com/c2e4bb6cc4a4fc7.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLnJJy77oKznWTj9X4BpfL8x3tXARsMvC8uCWq27CUOw&s"
  );

class Game {
  board;
  boardHeight = 250;
  boardWidth = 750;

  dinoWidth = 88;
  dinoHeight = 94;

  dinoX = 50;
  dinoY = this.boardHeight - this.dinoHeight;

  dino = {
    x: this.dinoX,
    y: this.dinoY,
    width: this.dinoWidth,
    height: this.dinoHeight,
  };

  velocityY = 0;
  velocityX = -8;
  dinoImg;
  context;
  gravity = 0.4;

  cactusHeight = 70;
  cactusX = 700;
  cactusY = this.boardHeight - this.cactusHeight;
  cactusArray = [];

  gameOver = false;

  collisionItemsList = [
    { img: "./img/cactus3.png", width: 102, occur: 10 },
    { img: "./img/cactus2.png", width: 69, occur: 20 },
    { img: "./img/cactus1.png", width: 34, occur: 100 },
  ];

  constructor(userImg, deadImg) {
    this.board = document.getElementById("board");
    this.board.height = this.boardHeight;
    this.board.width = this.boardWidth;
    this.context = board.getContext("2d");
    this.dinoImg = Game.createImage(userImg);
    this.deadImg = deadImg;
    this.dinoImg.onload = () =>
      this.context.drawImage(
        this.dinoImg,
        this.dino.x,
        this.dino.y,
        this.dino.width,
        this.dino.height
      );

    requestAnimationFrame(this.update.bind(this));
    document.addEventListener("keydown", this.move.bind(this));
    setInterval(this.placeItem.bind(this), 1000);
  }

  static createImage(url) {
    let img = new Image();
    img.src = url;
    return img;
  }

  move(e) {
    if (
      (e.code == "Space" || e.code == "ArrowUp") &&
      this.dino.y == this.dinoY
    ) {
      this.velocityY = -10;
    }
  }

  update() {
    if (this.gameOver) return;
    requestAnimationFrame(this.update.bind(this));
    this.context.clearRect(0, 0, this.board.width, this.board.height);
    //dino
    this.velocityY += this.gravity;
    this.dino.y = Math.min(this.dino.y + this.velocityY, this.dinoY);
    this.context.drawImage(
      this.dinoImg,
      this.dino.x,
      this.dino.y,
      this.dino.width,
      this.dino.height
    );

    //cactus
    for (let i = 0; i < this.cactusArray.length; i++) {
      let cactus = this.cactusArray[i];
      cactus.x += this.velocityX;
      this.context.drawImage(
        cactus.img,
        cactus.x,
        cactus.y,
        cactus.width,
        cactus.height
      );

      if (this.detectCollision(this.dino, cactus)) {
        this.gameOver = true;
        this.dinoImg.src = this.deadImg;
        this.dinoImg.onload = () =>
          this.context.drawImage(
            this.dinoImg,
            this.dino.x,
            this.dino.y,
            this.dino.width,
            this.dino.height
          );
      }
    }
  }

  placeItem() {
    const random = Math.random();
    const item = this.collisionItemsList.find(
      (item) => item.occur > random * 100
    );
    let cactus = {
      x: this.cactusX,
      y: this.cactusY,
      height: this.cactusHeight,
      ...item,
    };
    cactus.img = Game.createImage(item.img);

    this.cactusArray.push(cactus);
    if (this.cactusArray.length > 5) {
      this.cactusArray.shift();
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
