let players = JSON.parse(localStorage.getItem("players")) || [];
let games = JSON.parse(localStorage.getItem("games")) || [];

const playerName = document.getElementById("playerName");
const playerRating = document.getElementById("playerRating");
const addPlayerBtn = document.getElementById("addPlayerBtn");

const whitePlayer = document.getElementById("whitePlayer");
const blackPlayer = document.getElementById("blackPlayer");
const result = document.getElementById("result");
const saveGameBtn = document.getElementById("saveGameBtn");

const playersTable = document.getElementById("playersTable");
const gameHistory = document.getElementById("gameHistory");

const totalPlayers = document.getElementById("totalPlayers");
const totalGames = document.getElementById("totalGames");
const leaderName = document.getElementById("leaderName");

function saveData() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("games", JSON.stringify(games));
}

function addPlayer() {
  const name = playerName.value.trim();
  const rating = Number(playerRating.value);

  if (name === "") {
    alert("Write player name");
    return;
  }

  const player = {
    id: Date.now(),
    name: name,
    rating: rating,
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0
  };

  players.push(player);

  playerName.value = "";
  playerRating.value = 1200;

  saveData();
  render();
}

function deletePlayer(id) {
  players = players.filter(player => player.id !== id);
  games = games.filter(game => game.whiteId !== id && game.blackId !== id);

  saveData();
  render();
}

function fillSelects() {
  whitePlayer.innerHTML = "";
  blackPlayer.innerHTML = "";

  players.forEach(player => {
    whitePlayer.innerHTML += `<option value="${player.id}">${player.name}</option>`;
    blackPlayer.innerHTML += `<option value="${player.id}">${player.name}</option>`;
  });
}

function saveGame() {
  const whiteId = Number(whitePlayer.value);
  const blackId = Number(blackPlayer.value);
  const gameResult = result.value;

  if (whiteId === blackId) {
    alert("Players must be different");
    return;
  }

  const white = players.find(player => player.id === whiteId);
  const black = players.find(player => player.id === blackId);

  if (!white || !black) return;

  if (gameResult === "white") {
    white.wins++;
    black.losses++;
    white.points += 1;
    white.rating += 10;
    black.rating -= 10;
  }

  if (gameResult === "black") {
    black.wins++;
    white.losses++;
    black.points += 1;
    black.rating += 10;
    white.rating -= 10;
  }

  if (gameResult === "draw") {
    white.draws++;
    black.draws++;
    white.points += 0.5;
    black.points += 0.5;
    white.rating += 2;
    black.rating += 2;
  }

  const game = {
    id: Date.now(),
    whiteId: white.id,
    blackId: black.id,
    whiteName: white.name,
    blackName: black.name,
    result: gameResult
  };

  games.push(game);

  saveData();
  render();
}

function showPlayers() {
  playersTable.innerHTML = "";

  const sortedPlayers = [...players].sort((a, b) => {
    if (b.points === a.points) {
      return b.rating - a.rating;
    }

    return b.points - a.points;
  });

  sortedPlayers.forEach((player, index) => {
    playersTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${player.name}</td>
        <td>${player.rating}</td>
        <td>${player.wins}</td>
        <td>${player.losses}</td>
        <td>${player.draws}</td>
        <td>${player.points}</td>
        <td>
          <button class="delete-btn" onclick="deletePlayer(${player.id})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

function showGames() {
  gameHistory.innerHTML = "";

  games.slice().reverse().forEach(game => {
    let text = "";

    if (game.result === "white") {
      text = `${game.whiteName} won against ${game.blackName}`;
    }

    if (game.result === "black") {
      text = `${game.blackName} won against ${game.whiteName}`;
    }

    if (game.result === "draw") {
      text = `${game.whiteName} drew with ${game.blackName}`;
    }

    gameHistory.innerHTML += `<li>${text}</li>`;
  });
}

function showStats() {
  totalPlayers.textContent = players.length;
  totalGames.textContent = games.length;

  if (players.length === 0) {
    leaderName.textContent = "-";
    return;
  }

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  leaderName.textContent = sortedPlayers[0].name;
}

function render() {
  fillSelects();
  showPlayers();
  showGames();
  showStats();
}

addPlayerBtn.addEventListener("click", addPlayer);
saveGameBtn.addEventListener("click", saveGame);

render();