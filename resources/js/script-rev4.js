$(function() {

  //define storage keys
  const CARD_KEY = 'bingo-card';
  const TILES_KEY = 'clickedTiles';
  const DATE_KEY = 'bingo-date';

  const today = luxon.DateTime.utc().toISODate();

  //Populate
  const entries = [
    //"Cami says 'Sharing is caring', with feeling",
    "Great 'view'",
    "Stream dies WITHOUT BRIBES",
    "Food-food party",
    "Any of the ladies say 'UwU'",
    "Rude palian",
    "Burnt food",
    "Triple in a hole",
    "Jodie looses a shiny",
    "Chat says 'JODIE EAT' when applicable",
    "Cake party",
    "Jodie complains about full inventory",
    "Jodie's tool downgrades",
    "Game breaks for Jodie",
    "Visual glitch",
    //"Cami says 'MOIST', with feeling",
    "New follower",
    "Get raided",
    "New sub, not gifted",
    "Jodie catches something new",
    "*Restoring stamina*",
    "Jodie swings the wrong tool",
    "Get bits",
    "Filling 'holes'",
    "5 gifted subs",
    //"Fall damage off a cliff",
    //"Cami announces an air break",
    "Jodie says 'I like a big one'",
    //"Crowned victory royale",
    "Jodie says 'Core is inside me'",
    "Bush innuendo",
    "Apple core innuendo",
    "Jodie says 'GET REKT'",
    "Jodie says 'Feck uff'",
    "Jodie drowns",
    "Mods get bullied",
    "Sammi says '___, HONESTLY'",
    "Sammi says 'Oh dear'",
    "Jodie expresses her love to BooBear"
  ];

  const clickSounds = [
    //"resources/audio/UwU - Cami.mp3",
    "resources/audio/UwU - Jodie.mp3",
    "resources/audio/UwU - Sammi.mp3",
  ]

  const staticEntries = [];
  staticEntries.push(...entries);

  const staticClickSounds = [];
  staticClickSounds.push(...clickSounds);

  let wonLine = false;
  let wonFullHouse = false;

  let lastDate = JSON.parse(localStorage.getItem(DATE_KEY));
  if (!lastDate) {
    console.log('Date value not found');
    localStorage.clear();
  }
  else if (lastDate !== today) {
    console.log('Saved state too old');
    localStorage.clear();
  }
  else {
    console.log('Resuming saved state');
    $('#refreshButton').hide();
  }

  // Retrieve cached bingo card or generate a new one
  let spaces = JSON.parse(localStorage.getItem(CARD_KEY));
  let clickedTiles = new Map(); // Define clickedTiles map
  if (!spaces) {
    spaces = generateRandomBingoCard();
    localStorage.setItem(CARD_KEY, JSON.stringify(spaces));
  } else {
    // Restore clicked tiles from localStorage
    clickedTiles = new Map(JSON.parse(localStorage.getItem(TILES_KEY)) || []);
    clickedTiles.forEach((value, key, map) => {
    });
  }

  // Draw the board
  const board = $("#board");
  for (let i = 0; i < spaces.length; i++) {
    const boardTile = document.createElement('div');

    const tileText = document.createElement('p');
    tileText.innerText = spaces[i];
    boardTile.appendChild(tileText);

    boardTile.classList.add('item');
    if (i === 12 || clickedTiles.has(i)) {
      boardTile.classList.add('clicked');
      var timestampSpan = document.createElement("span");
      if (clickedTiles.has(i)) {
        timestampSpan.innerText = clickedTiles.get(i);
      }
      else
      {
        timestampSpan.innerText = "";
      }
      timestampSpan.classList.add('timestamp');
      timestampSpan.style.display = 'none';
      boardTile.appendChild(timestampSpan);
    }
    board.append(boardTile);
  }

  function generateRandomBingoCard() {
    const card = [];
    let entries = [];
    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        card[i] = "***Free***";
      } else {
        if (entries.length === 0) {
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
    if (clickSounds.length === 0) {
      clickSounds.push(...staticClickSounds);
    }
    const choice = Math.floor(Math.random() * clickSounds.length);
    (new Audio(clickSounds[choice])).play();
    clickSounds.splice(choice, 1);
  }

  // Refresh button functionality
  $("#refreshButton").on("click", function() {
    localStorage.removeItem(TILES_KEY);
    clickedTiles = new Map(); // Clear clickedTiles map
    wonLine = false;
    wonFullHouse = false;
    spaces = generateRandomBingoCard();
    localStorage.setItem(CARD_KEY, JSON.stringify(spaces));

    // Update the displayed bingo card
    const boardTiles = $(".item");
    boardTiles.each(function(index) {
      if(index !== 12) {
        const tileText = $(this).find('p');
        tileText.text(spaces[index]);
        $(this).removeClass('clicked');
      }
    });

    //loser();
  });

  $(".item").on("click", function() {
    playRandomClick();
    if ($(this).index() === 12) {
      return
    }

    if ($(this).hasClass("clicked")) {
      $(this).removeClass("clicked");
      $(this).children(".timestamp").remove();
    }
    else {
      $(this).addClass("clicked");
      $('#refreshButton').hide();

      var timestampSpan = document.createElement("span");
      timestampSpan.innerText = luxon.DateTime.utc().toISO();
      timestampSpan.classList.add('timestamp');
      timestampSpan.style.display = 'none';
      $(this).append(timestampSpan);
    }

    // Update the clicked tile's state in localStorage
    const clickedTiles = new Map($(".item.clicked")
      .map(function(tile) {
        return {key: $(this).index(), value: $(this).find("span")[0].innerText};
      })
      .get().filter(entry => entry.key !== 12)
      .map(entry => {return [entry.key, entry.value];}));
    console.log(clickedTiles);
    localStorage.setItem(TILES_KEY, JSON.stringify(Array.from(clickedTiles.entries())));
    localStorage.setItem(DATE_KEY, JSON.stringify(today));
    //If people start leaving their browsers overnight we'll have to reset the board on date mismatch here...

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
      return count === numbers.length;
    }

    function checkAllTiles() {
      return $("#board").children(".clicked").length === check.length;
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
