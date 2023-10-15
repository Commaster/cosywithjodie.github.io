$(function() {

  //define cache key
  const CACHE_KEY = 'bingo-card'; // Define the cache key

  //Populate
  const entries = [
    "*Sharing is caring*",
    "Great 'view'",
    "Stream dies",
    "Food-food party",
    "*UwU*",
    "Rude palian",
    "Burnt food",
    "Triple in a hole",
    "A shiny gets away",
    "*JODIE EAT!*",
    "Cake party",
    "Inventory full!",
    "Tool downgraded",
    "Game breaks",
    "Visual glitch",
    "*MOIST*",
    "New follower",
    "Get raided",
    "New sub",
    "Catch something new",
    "'Restoring stamina'",
    "Wrong tool",
    "Get bits",
    "Filling 'holes'",
    "5 gifted subs",
    "Fall damage off a cliff",
    "Air break",
    "*I like a big one!*",
    "Crowned victory royale",
    "*Core's inside me!*",
    "Bush innuendo",
    "Apple core innuendo",
    "*GET REKT*",
    "*Feck uff*",
    "Jodie drowns",
    "Mods get bullied",
    "*___, HONESTLY!*"
  ];

  const clickSounds = [
    "resources/audio/UwU - Cami.mp3",
    "resources/audio/UwU - Jodie.mp3",
    "resources/audio/UwU - Sammi.mp3",
  ]

  const staticEntries = [];
  staticEntries.push(...entries);

  const staticClickSounds = [];
  staticClickSounds.push(...clickSounds);

  let wonLine = false;
  let wonFullHouse = false;

  // Retrieve cached bingo card or generate a new one
  let spaces = JSON.parse(localStorage.getItem(CACHE_KEY));
  let clickedTiles = []; // Define clickedTiles array
  if (!spaces) {
    spaces = generateRandomBingoCard();
    localStorage.setItem(CACHE_KEY, JSON.stringify(spaces));
  } else {
    // Restore clicked tiles from localStorage
    clickedTiles = JSON.parse(localStorage.getItem("clickedTiles")) || [];
    clickedTiles.forEach(index => {
    });
  }

  // Draw the board
  const board = $("#board");
  for (let i = 0; i < spaces.length; i++) {
    const boardTile = document.createElement('div');
    boardTile.classList.add('item');
    if (i === 12 || clickedTiles.includes(i)) {
      boardTile.classList.add('clicked');
    }
    const tileText = document.createElement('p');
    tileText.innerText = spaces[i];
    boardTile.appendChild(tileText);
    board.append(boardTile);
  }

  function generateRandomBingoCard() {
    const card = [];
    let entries = [];
    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        card[i] = "***Free***";
      } else {
        if (entries.length == 0) {
            entries.push(...staticEntries);
          }
        const choice = Math.floor(Math.random() * entries.length);
        card[i] = entries[choice];
        entries.splice(choice, 1);
      }
    }
    return card;
  }

  function playRandomClick() {
    if (clickSounds.length == 0) {
      clickSounds.push(...staticClickSounds);
    }
    const choice = Math.floor(Math.random() * clickSounds.length);
    (new Audio(clickSounds[choice])).play();
    clickSounds.splice(choice, 1);
  }

  // Refresh button functionality
  $("#refreshButton").click(function() {
    localStorage.removeItem("clickedTiles");
    clickedTiles = []; // Clear clickedTiles array
    wonLine = false;
    wonFullHouse = false;
    spaces = generateRandomBingoCard();
    localStorage.setItem(CACHE_KEY, JSON.stringify(spaces));

    // Update the displayed bingo card
    const boardTiles = $(".item");
    boardTiles.each(function(index) {
      if(index != 12) {
        const tileText = $(this).find('p');
        tileText.text(spaces[index]);
        $(this).removeClass('clicked');
      }
    });

    //loser();
  });

  $(".item").click(function() {
    if ($(this).index() == 12) {
      return
    }
    $(this).toggleClass("clicked");
    playRandomClick();
  
    // Update the clicked tile's state in localStorage
    const clickedTiles = $(".item.clicked").map(function() {
      return $(this).index();
    }).get();
    localStorage.setItem("clickedTiles", JSON.stringify(clickedTiles));

    //check for winner! There is probably an algo for this...
      const check = $("#board").children();

      function checkTiles(numbers) {
          let count = 0;
          // ... spreads the numbers from the array to be individual parameters
          numbers.forEach(function (currentNumber) {
              if ($(check[currentNumber]).hasClass("clicked")) {
                  count++;
              }
          });
          if (count === numbers.length) {
            return true;
          }
          return false;
      }

      function checkAllTiles() {
        if ($("#board").children(".clicked").length === check.length) {
          return true;
        }
        return false;
      }

      if (wonFullHouse) {
      }
      else if (checkAllTiles()) {
        bigWinner();
      }

      if (wonLine) {
      }
      //ROWS
      else if (checkTiles([0, 1, 2, 3, 4])) {
          winner();
      } else if (checkTiles([5, 6, 7, 8, 9])) {
          winner();
      } else if (checkTiles([10, 11, 12, 13, 14])) {
          winner();
      } else if (checkTiles([15, 16, 17, 18, 19])) {
          winner();
      } else if (checkTiles([20, 21, 22, 23, 24])) {
          winner();
      }
      //COLUMNS!
      else if (checkTiles([0, 5, 10, 15, 20])) {
          winner();
      } else if (checkTiles([1, 6, 11, 16, 21])) {
          winner();
      } else if (checkTiles([2, 7, 12, 17, 22])) {
          winner();
      } else if (checkTiles([3, 8, 13, 18, 23])) {
          winner();
      } else if (checkTiles([4, 9, 14, 19, 24])) {
          winner();
      }
      //CRISS CROSS
      else if (checkTiles([0, 6, 12, 18, 24])) {
          winner();
      } else if (checkTiles([4, 8, 12, 16, 20])) {
          winner();
      } else {
          //loser();
      }
  });

  // function loser() {
  //   $("#winner").addClass("hidden");
  // }

  function winner() {
    wonLine = true;
    Swal.fire({
      icon: 'success',
      title: 'Congratulations!',
      text: '5 in a row!',
      confirmButtonText: 'OK'
    });
  }

  function bigWinner() {
    wonFullHouse = true;
    Swal.fire({
      icon: 'success',
      title: 'Congratulations!',
      text: 'Full House!',
      confirmButtonText: 'YAY'
    });
  }

});
