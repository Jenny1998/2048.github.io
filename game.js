class Game {
  constructor(size) {
    this.size = size;
    this.score = 0;
    this.won = false;
    this.over = false;
    this.board = this.getNewBoard(size);
    this.moveList = [];
    this.winList = [];
    this.lostList = [];
  }

  onMove(callback) {
    this.moveList.push(callback);
  }
  onWin(callback) {
    this.winList.push(callback);
  }

  onLose(callback) {
    this.lostList.push(callback);
  }

  getGameState() {
    return {
      board: this.board,
      score: this.score,
      won: this.won,
      over: this.over
    };
  }

  loadGame(gameState) {
    this.score = gameState.score;
    this.board = gameState.board;
    this.won = gameState.won;
    this.over = gameState.over;
  }

  toString() {
    var result = "";
    for (let line = 0; line < this.size; line++) {
      let start = line * this.size;
      for (let i = 0; i < this.size; i++) {
        let val = this.board[start + i];
        val != 0 ? (val = `[${this.board[start + i]}]`) : (val = `[ ]`);
        result = result + val;
        // process.stdout.write(val);
      }
      result = result + "\n";
      // process.stdout.write("\n");
    }

    return result;
  }

  setupNewGame() {
    this.score = 0;
    this.won = false;
    this.over = false;
    this.board = this.getNewBoard(this.size);
    this.moveList = [];
    this.winList = [];
    this.lostList = [];
  }

  transpose(arr) {
    var newArr = [];
    while (arr.length) newArr.push(arr.splice(0, this.size));
    let array = newArr[0].map((col, i) => newArr.map(row => row[i]));
    var merged = [].concat.apply([], array);
    return merged;
  }

  moveUp() {
    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }
  moveDown() {
    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);
  }
  moveRight() {
    for (let i = 0; i < this.size; i++) {
      let row = this.board.splice(i * this.size, this.size);
      row = this.mergeRight(row);
      row = this.shiftRight(row);
      this.board.splice(i * this.size, 0, ...row);
    }
  }

  mergeRight(row) {
    var lastNonZeroCellIndex = row.length - 1;
    for (var index = row.length - 1; index > 0; index--) {
      lastNonZeroCellIndex = row[index] === 0 ? lastNonZeroCellIndex : index;
      if (row[lastNonZeroCellIndex] === row[index - 1]) {
        row[index - 1] *= 2;
        this.updateScore(row[index - 1]);

        row[lastNonZeroCellIndex] = 0;
        index = index - 1;
        lastNonZeroCellIndex = index - 1;
      }
    }
    return row;
  }
  shiftRight(row) {
    var count = row.length - 1;
    for (var index = row.length - 1; index >= 0; index--) {
      if (row[index] !== 0) {
        row[count--] = row[index];
      }
    }
    while (count >= 0) {
      row[count--] = 0;
    }
    return row;
  }

  moveLeft() {
    for (let i = 0; i < this.size; i++) {
      let row = this.board.splice(i * this.size, this.size);
      row = this.mergeLeft(row);
      row = this.shiftLeft(row);
      this.board.splice(i * this.size, 0, ...row);
    }
  }

  mergeLeft(row) {
    var lastNonZeroCellIndex = 0;
    for (var index = 0; index < row.length - 1; index++) {
      lastNonZeroCellIndex = row[index] === 0 ? lastNonZeroCellIndex : index;
      if (row[lastNonZeroCellIndex] === row[index + 1]) {
        row[index + 1] *= 2;
        this.updateScore(row[index + 1]);
        row[lastNonZeroCellIndex] = 0;
        index = index + 1;
        lastNonZeroCellIndex = index + 1;
      }
    }
    return row;
  }

  shiftLeft(row) {
    var count = 0;
    for (var index = 0; index < row.length; index++) {
      if (row[index] !== 0) {
        row[count++] = row[index];
      }
    }
    while (count < row.length) {
      row[count++] = 0;
    }
    return row;
  }

  updateScore(num) {
    this.score += num;
    if (num === 2048) {
      this.won = true;
      if (this.won)
        for (let i = 0; i < this.winList.length; i++)
          this.winList[i](this.getGameState());
    }
  }
  isGameOver(arr) {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        if (
          x + 1 < this.size &&
          arr[x * this.size + y] == arr[(x + 1) * this.size + y]
        ) {
          return false;
        } else if (
          y + 1 < this.size &&
          arr[x * this.size + y] == arr[x * this.size + y + 1]
        ) {
          return false;
        }
      }
    }
    return true;
  }
  move(direction) {
    switch (direction) {
      case "left":
        // console.log("Moving Left!");
        this.moveLeft();
        break;
      case "right":
        // console.log("Moving Right!");
        this.moveRight();
        break;
      case "up":
        // console.log("Moving Up!");
        this.moveUp();
        break;
      case "down":
        // console.log("Moving Down!");
        this.moveDown();
        break;
      default:
        return new Error("Input should be left or right or up or down.");
    }

    this.addRandomTile(this.board);

    for (let i = 0; i < this.moveList.length; i++)
      this.moveList[i](this.getGameState());
    if (this.won)
      for (let i = 0; i < this.winList.length; i++)
        this.winList[i](this.getGameState());
    if (!this.won && this.over)
      for (let i = 0; i < this.lostList.length; i++)
        this.lostList[i](this.getGameState());
  }

  getNewBoard(size) {
    let arr = new Array(size * size);
    arr.fill(0);
    arr = this.addRandomTile(this.addRandomTile(arr));
    return arr;
  }

  addRandomTile(arr) {
    let tile = 0;
    Math.random() < 0.9 ? (tile = 2) : (tile = 4);
    let indexes = [],
      i = -1;
    while ((i = arr.indexOf(0, i + 1)) != -1) {
      indexes.push(i);
    }
    if (indexes.length >= 1) {
      let index = Math.floor(Math.random() * indexes.length);
      arr[indexes[index]] = tile;
    }
    if (indexes.length == 1 && this.isGameOver(this.board)) {
      this.over = true;
    }
    return arr;
  }
}

let game = new Game(4);

// console.log(game.board);
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

update();

$("#restart").click(function() {

  game.setupNewGame();
  update();
});
function drawCell(val, x, y) {
  switch (val) {
    case 0:
      ctx.fillStyle = "#9E9E9E";
      break;
    case 2:
      ctx.fillStyle = "#e3d9c6";
      break;
    case 4:
      ctx.fillStyle = "#FFBC39";
      break;
    case 8:
      ctx.fillStyle = "#f67828";
      break;
    case 16:
      ctx.fillStyle = "#FFDD9A";
      break;
    case 32:
      ctx.fillStyle = "#cb8e00";
      break;
    case 64:
      ctx.fillStyle = "#cb7375";
      break;
    case 128:
      ctx.fillStyle = "#FF7F50";
      break;
    case 256:
      ctx.fillStyle = "#f1dd38";
      break;
    case 512:
      ctx.fillStyle = "#f99a1c";
      break;
    case 1024:
      ctx.fillStyle = "#D2691E";
      break;
    case 2048:
      ctx.fillStyle = "yellow";
      break;
    default:
      ctx.fillStyle = "#ff0080";
  }
  ctx.fillRect(x + 5, y + 5, 110, 110);
}
function update() {
  ctx.clearRect(0, 0, 480, 480);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      drawCell(game.board[i * 4 + j], 120 * j, 120 * i);
      ctx.fillStyle = "#664033";
      ctx.font = "40px monospace";
      ctx.textAlign = "center";
      if (game.board[i * 4 + j] == 0) {
        continue;
      }
      ctx.fillText(game.board[i * 4 + j], 60 + 120 * j, 70 + 120 * i);
    }
  }
  if (game.won) {
    setTimeout(function() {
      // ctx.clearRect(0, 0, 480, 480);
      ctx.fillStyle = "rgba(255, 165,0,0.7)";
      ctx.fillRect(0, 0, 480, 480);
      ctx.fillStyle = "#664033";
      ctx.textAlign = "center";
      ctx.font = "40px 'Arial'";
      ctx.fillText("Love you Mr. Miner 😘", 240, 240);
    }, 800);
  } else if (game.over) {
    setTimeout(function() {
      ctx.fillStyle = "rgba(255, 165,0,0.7)";
      ctx.fillRect(0, 0, 480, 480);
      ctx.fillStyle = "#664033";
      ctx.textAlign = "center";
      ctx.font = "40px 'Arial'";
      ctx.fillText("Try again! ", 240, 240);
    }, 800);
  }
  $("#score").html(game.score);
}
$(document).keydown(function(event) {
  if (game.over || game.won) {
    return;
  }
  let key = event.keyCode ? event.keyCode : event.which;
  switch (key) {
    case 37:
      game.move("left");
      break;
    case 38:
      game.move("up");
      break;
    case 39:
      game.move("right");
      break;
    case 40:
      game.move("down");
      break;
  }
  update();
});
