import Game from "game.js";

$(document).ready(function() {
  alert("hi");
});
let game = new Game(4);

// console.log(game.board);
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

update();

$("#restart").click(function() {
  console.log("clicked");
  game.setupNewGame();
  update();
});
function drawCell(val, x, y) {
  switch (val) {
    case 0:
      ctx.fillStyle = "#FFDD9A";
      break;
    case 2:
      ctx.fillStyle = "#FFCA63";
      break;
    case 4:
      ctx.fillStyle = "#FFBC39";
      break;
    case 8:
      ctx.fillStyle = "#FFA900";
      break;
    case 16:
      ctx.fillStyle = "#C58200";
      break;
    case 32:
      ctx.fillStyle = "#CB6600";
      break;
    case 64:
      ctx.fillStyle = "#FFB119";
      break;
    case 128:
      ctx.fillStyle = "#FFA900";
      break;
    case 256:
      ctx.fillStyle = "#FFD200";
      break;
    case 512:
      ctx.fillStyle = "#FF158";
      break;
    case 1024:
      ctx.fillStyle = "#FF7F19";
      break;
    case 2048:
      ctx.fillStyle = "#FF100";
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
      ctx.fillText(game.board[i * 4 + j], 60 + 120 * j, 70 + 120 * i);
    }
  }
  if (game.won) {
    setTimeout(function() {
      ctx.clearRect(0, 0, 480, 480);
      ctx.fillStyle = "rgba(255, 165, 0,1)";
      ctx.fillRect(0, 0, 480, 480);
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("You Won! ", 240, 240);
    }, 800);
  } else if (game.over) {
    setTimeout(function() {
      ctx.clearRect(0, 0, 480, 480);
      ctx.fillStyle = "##bf6437";
      ctx.fillRect(0, 0, 480, 480);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("You Lost! ", 240, 240);
    }, 800);
  }
  $("#score").html("Score : " + game.score);
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
