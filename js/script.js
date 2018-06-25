//Stuff here needs to load early

//Global variables
var square = document.getElementsByClassName("square");
var turn = 0; //Number of turns so far
var player = 1; //Active player
var playerCount = 2; //Players playing
//Controls x and y of game grid (number of squares)
var grid = 99; //Odd numbers only!
var size = grid * 60; //60 is the height/width of square

//User color picker
$(".basic").spectrum({
  showPaletteOnly: true,
  showPalette: true,
  color: "white", //idk why but this is necessary
  palette: [
    ['black', 'white', 'blanchedalmond',
    'rgb(255, 128, 0);', 'purple'],
    ['red', 'yellow', 'green', 'blue', 'violet']
  ]
});

$(document).ready(function() {

  //Toggle popup/inline mode
  $.fn.editable.defaults.mode = 'popup';

  //Make usernames editable
  $('#player1').editable();
  $('#player2').editable();

  //Set default colors
  $("#color1").spectrum("set", "blue")
  $("#color2").spectrum("set", "red")

  //Give username modal some default options (bots)
  $("#player1").click(function() {
    $(document.getElementsByClassName("popover-content")).append('<br /><a class="smartBot3000Link" href="#" style="color:#337ab7;">SmartBot3000</a>');
    $(".smartBot3000Link").click(function() {
      document.getElementById("player1").innerHTML = "SmartBot3000";
    });
  });
  $("#player2").click(function() {
    $(document.getElementsByClassName("popover-content")).append('<br /><a class="smartBot3000Link" href="#" style="color:#337ab7;">SmartBot3000</a>');
    $(".smartBot3000Link").click(function() {
      document.getElementById("player2").innerHTML = "SmartBot3000";
    });
  });

  //Update square colors when user clicks palette
  $(".sp-replacer").click(function() {
    squareColor();
  });

  game();

  $("#centerView").click(function() {
    centerView();
  });

  $("#resetConfirm").click(function() {
    document.getElementById("turnCounter").innerHTML = "Turn: 1";
    document.getElementById("game").innerHTML = ""; //clear game
    turn = 0;
    player = 1;
    $(document.getElementsByClassName("usernameBox")).css({
    "-webkit-box-shadow" : "none", "border-color" : "#46b8da"});
    document.getElementById("moveList").value = "";
    game(grid, size);
  });
});

///////////////////////////////Center View Function
//Moves user view to starting square
function centerView() {
  var gameBox = document.getElementById("gameBox");
  gameBox.scrollTop = (size/2-300+7); //300 = height / 2
  gameBox.scrollLeft = (size/2-gameBox.offsetWidth/2+7); //7 makes it better
};

///////////////////////////////Update Game Function
//Updates which squares are available
function gameUpdate() {
  var square = document.getElementsByClassName("square");
  for (let i = 0; i < square.length; i++) {
    if (square[i].hasAttribute("data-owner")) {
      $(square[i]).attr("data-lock", "1");
      $(square[i+1]).attr("data-lock", "0");
      $(square[i-1]).attr("data-lock", "0");
      $(square[i+grid]).attr("data-lock", "0");
      $(square[i-grid]).attr("data-lock", "0");
    };
  };
  highlight();
  squareColor();
}

///////////////////////////Square Coloring Function
//Updates colors of user controlled squares
function squareColor() {
  //Color the squares according to user choice
  var color1 = $("#color1").spectrum("get");
  var color2 = $("#color2").spectrum("get");
  for (let i = 0; i < square.length; i++) {
    if (square[i].hasAttribute("data-owner")) {
      var owner = square[i].getAttribute("data-owner");
      if (owner == 1) {
        $(square[i]).css("background-color", color1);
      }
      else if (owner == 2) {
        $(square[i]).css("background-color", color2);
      };
    };
  };
};
////////////////////////Highlight Function
//Decides whether or not ot highlight available squares
function highlight() {
  if(document.getElementById("highlight").checked) {
    for (let i = 0; i < square.length; i++) {
      if (square[i].getAttribute("data-lock") == 0
      && square[i].hasAttribute("data-owner") == false) {
        $(square[i]).css("background-color", "#555");
      };
    };
  } else {
    for (let i = 0; i < square.length; i++) {
      if (square[i].getAttribute("data-lock") == 0
      && square[i].hasAttribute("data-owner") == false) {
        $(square[i]).css("background-color", "#222");
      };
    };
    if (turn === 0 && player === 1) { //Gives middle square highlight
      $(square[Math.floor(grid*grid/2)]).css("background-color", "#555");
    };
  };
};

//////////////////////////Move Notation Function
var abcTo123 = ["a", "b", "c", "d", "e", "f", "g", "h",
                "i", "j", "k", "l", "m", "n", "o", "p", "q", "r",
                "s", "t", "u", "v", "w", "x", "y", "z"];
function moveNotation(thisSquareId) {
  var leftestLeft = grid+1; //sets leftest to an easy-to-change number
  var lowestLow = 0; //sets lowest to an easy-to-change number
  //No amount of comments can explain what's about to happen
  for (let i = 0; i < square.length; i++) {
    if (square[i].hasAttribute("data-owner")) {
      var xAxis = i%grid;
      var yAxis = Math.floor(i/grid);
      if (xAxis < leftestLeft) {
        leftestLeft = xAxis;
      };
      if (yAxis > lowestLow) {
        lowestLow = yAxis;
      };
    };
  };
  var A1squareId = lowestLow*grid+leftestLeft;
  var relativePosition = A1squareId-thisSquareId;
  var relativeY = Math.ceil(relativePosition/grid);
  relativeY = Math.abs(relativeY); //y is negative
  var relativeX = relativePosition-relativeY*grid;
  relativeX = Math.abs(relativeX); //x is negative

  //Exception for when move is A1
  var a1LeftCheck = 0;
  var a1LowCheck = 0;
  if (relativeX == 0 && relativeY == 0) {
    for (let i = 0; i < square.length; i++) {
      if (square[i].hasAttribute("data-owner")) {
        if (i-thisSquareId > 0) {
          a1LeftCheck = 1;
        };
        if ((thisSquareId-i)%grid == 0 && thisSquareId !== i) {
          a1LowCheck = 1;
        };
      };
    };
  };

  var finalMove = "" + abcTo123[relativeX] + (relativeY+1);
  if (a1LeftCheck !== a1LowCheck) {
    if (a1LeftCheck === 1) {
      finalMove = finalMove + "L";
    }
    else if (a1LowCheck === 1) {
      finalMove = finalMove + "d";
    };
  };
  if (turn%2 === 0) {
    $(document.getElementById("moveList")).append(" " + (turn/2+1) + ".");
  };
  $(document.getElementById("moveList")).append(" " + finalMove);
};


////////////////////////////Update Player Function
//Also highlights active players box
function whosNext() {
  if (player < playerCount) {
    player++;
  } else {
    player = 1;
  };
  $(document.getElementsByClassName("usernameBox")).css({
  "-webkit-box-shadow" : "none", "border-color" : "#46b8da"});
  if (player == 1) {
    $(document.getElementById("player1Box")).css({
    "-webkit-box-shadow" : "inset 0 0 4px 2px #d9534f", "border-color" : "#d9534f"});
  }
  else if (player == 2) {
    $(document.getElementById("player2Box")).css({
    "-webkit-box-shadow" : "inset 0 0 4px 2px #d9534f", "border-color" : "#d9534f"});
  };
};

///////////////////////////Did Someone Win? Function
//bot is used to kill the bot logic loop later on
function winCheck(bot) {
  for (let i = 0; i < square.length; i++) {
    if (square[i].hasAttribute("data-owner")) {
      var owner = square[i].getAttribute("data-owner");
      if (owner == square[i+2].getAttribute("data-owner")
        && owner == square[i+1].getAttribute("data-owner")
        && owner == square[i-1].getAttribute("data-owner")
        && owner == square[i-2].getAttribute("data-owner"))
      {
        win(owner, "Horizontal");
        if (bot > 0) {
          return 0;
        } else {
          break;
        };
      }
      else if (owner == square[i+grid*2].getAttribute("data-owner")
      && owner == square[i+grid].getAttribute("data-owner")
      && owner == square[i-grid].getAttribute("data-owner")
      && owner == square[i-grid*2].getAttribute("data-owner"))
      {
        win(owner, "Vertical");
        if (bot > 0) {
          return 0;
        } else {
          break;
        };
      }
      else if (owner == square[i+grid*2-2].getAttribute("data-owner")
      && owner == square[i+grid-1].getAttribute("data-owner")
      && owner == square[i-grid+1].getAttribute("data-owner")
      && owner == square[i-grid*2+2].getAttribute("data-owner"))
      {
        win(owner, "Diagonal");
        if (bot > 0) {
          return 0;
        } else {
          break;
        };
      }
      else if (owner == square[i+grid*2+2].getAttribute("data-owner")
      && owner == square[i+grid+1].getAttribute("data-owner")
      && owner == square[i-grid-1].getAttribute("data-owner")
      && owner == square[i-grid*2-2].getAttribute("data-owner"))
      {
        win(owner, "Diagonal");
        if (bot > 0) {
          return 0;
        } else {
          break;
        };
      };
    };
  };
};

//////////////////////////////Win/End Game Function
//Scoreboard for end of game
function win(player, direction) {
  for (let i = 0; i < square.length; i++) {
    $(square[i]).attr("data-lock", "1");
    if (square[i].hasAttribute("data-owner") == false) {
      $(square[i]).css("background-color", "#222");
    };
  };
  if (player == 1) {
    player = (document).getElementById("player1").innerHTML;
  }
  else if (player == 2) {
    player = (document).getElementById("player2").innerHTML;
  }
  document.getElementById("winTitle").innerHTML =
    player + " wins!";
  document.getElementById("winBody").innerHTML =
    "Win type: " + direction + "<br>" +
    "Turns: " + Math.ceil((turn+1)/2);
  $("#winModal").modal('show');
  $(document.getElementsByClassName("usernameBox")).css({
  "-webkit-box-shadow" : "none", "border-color" : "#46b8da"});
  player = 1;
};

////////////////////////////Bot Management Function
function botManager() {
  var bot = 0;
  if ((document).getElementById("player1").innerHTML.toLowerCase()
  == "smartbot3000") {
    bot = 1;
    if (player === bot) {
      smartBot3000(bot);
      whosNext();
      gameUpdate();
      bot = winCheck(bot);
      return bot;
    } else {
      bot = 0;
    };
  };
  if ((document).getElementById("player2").innerHTML.toLowerCase()
  == "smartbot3000") {
    bot = 2;
    if (player === bot) {
      smartBot3000(bot);
      whosNext();
      gameUpdate();
      bot = winCheck(bot);
      return bot;
    } else {
      bot = 0;
    };
  };
  return bot;
};

////////////////////////////SmartBot3000 Function 1
function smartBot3000(bot) {
  //bot2Array is keepgoing?, current value, current owner, best value, best value id
  var bot2Array = [1, 0, 0, 0, 0];
  for (let a = 0; a < square.length; a++) {
    if (square[a].getAttribute("data-lock") == 0
    && square[a].hasAttribute("data-owner") == false) {
      bot2Array = analyzeDirection(a, bot, bot2Array, 1);
      bot2Array = analyzeDirection(a, bot, bot2Array, -1);
      bot2Array = analyzeDirection(a, bot, bot2Array, grid);
      bot2Array = analyzeDirection(a, bot, bot2Array, -grid);
      bot2Array = analyzeDirection(a, bot, bot2Array, (grid+1));
      bot2Array = analyzeDirection(a, bot, bot2Array, (-grid+1));
      bot2Array = analyzeDirection(a, bot, bot2Array, (-grid-1));
      bot2Array = analyzeDirection(a, bot, bot2Array, (grid-1));
    };
  };
  var bestSquareIndex = bot2Array[4]
  $(square[bestSquareIndex]).attr("data-owner", bot);
  
  turn++; // this stuff should be moved to bot management function
  
  //Move Notation Stuff
  moveNotation(bestSquareIndex);
};

////////////////////////////SmartBot3000 Function 2
function analyzeDirection(b, bot, bot2Array, increment) {
  bot2Array[0] = 1; //Keep going? 1 = yes, 0 = no
  bot2Array[1] = 0; //Value of the current square
  bot2Array[2] = 0; //Player who would benefit most from owning this square
  //Check bot2Array[2] for elet rrors.. it might get overwritten easily
  //bot2Array[3] = Best square value so far
  //bot2Array[4] = Index number of that best square


  //The section below determines if the square is "central"
  //"Central" squares get a value of +1
  //This prevents bot from going far away at beginning
  if (b === (Math.floor(grid*grid/2))+1
  || b === (Math.floor(grid*grid/2))+2
  || b === (Math.floor(grid*grid/2))-1
  || b === (Math.floor(grid*grid/2))-2
  || b === (Math.floor(grid*grid/2))+grid
  || b === (Math.floor(grid*grid/2))+(grid*2)
  || b === (Math.floor(grid*grid/2))-grid
  || b === (Math.floor(grid*grid/2))-(grid*2)
  || b === (Math.floor(grid*grid/2))+grid+1
  || b === (Math.floor(grid*grid/2))+grid-1
  || b === (Math.floor(grid*grid/2))-grid-1
  || b === (Math.floor(grid*grid/2))-grid+1) {
    bot2Array[1] = bot2Array[1] + 1;
  }
  //The section below executes analyzeAdjacent if "keep going?" is 1
  analyzeAdjacent(b, bot, bot2Array, increment);
  if (bot2Array[0] == 1) {
    bot2Array = analyzeAdjacent(b, bot, bot2Array, increment*2);
    if (bot2Array[0] == 1) {
      bot2Array = analyzeAdjacent(b, bot, bot2Array, increment*3);
      if (bot2Array[0] == 1) {
        bot2Array = analyzeAdjacent(b, bot, bot2Array, increment*4);
        if (bot2Array[0] == 1) {
          bot2Array = analyzeAdjacent(b, bot, bot2Array, increment*5);
          return bot2Array;
        } else {
          return bot2Array;
        };
      } else {
        return bot2Array;
      };
    } else {
      return bot2Array;
    };
  } else {
    return bot2Array;
  };
};

////////////////////////////SmartBot3000 Function 3
//Analyze a single square by comparing it to its neighbour
function analyzeAdjacent(d, bot, bot2Array, incrementReal) {
  var otherGuy = square[d+incrementReal].getAttribute("data-owner");
  if (otherGuy !== false) {
    if (bot2Array[2] === 0 || bot2Array[2] == otherGuy) {
      bot2Array[2] = otherGuy;
      bot2Array[1] = bot2Array[1] + 1;
      return bot2Array;
    }
    else if (bot2Array[1] >= bot2Array[3]) {
      if (bot2Array[1] == bot2Array[3]
      && otherGuy !== bot
      || bot2Array[1] > bot2Array[3]) {
        bot2Array.pop(); bot2Array.pop();
        bot2Array.push(bot2Array[1], d);
        bot2Array[0] = 0;
        return bot2Array; //might malfunction at 5 in a row
      } else {
        return bot2Array;
      };
    } else {
      bot2Array[0] = 0;
      return bot2Array;
    };
  } else {
    return bot2Array;
  };
};

///////////////////////////////MAIN GAME FUNCTION
function game() {

  //Hide loading screen
  $(document.getElementById("loadingScreen")).css("display", "none");

  //Game board sizing. 22 is 10 + scrollbar
  document.getElementById("game").setAttribute(
    "style", "width:"+(size+22)+"px;height:"+(size+22)+"px;"
  );

  //Create squares, create new row, and repeat to make grid
  for (let i = 0; i < grid; i++) {
    for (let x = 0; x < grid; x++) { //Can't use var i again
      //New Squares
      var div = document.createElement("div");
      div.className = "square";
      div.setAttribute("data-lock", "1");
      document.getElementById("game").appendChild(div);
    };
    //New row
    $(document.getElementById("game")).append("<br>");
  };

  var square = document.getElementsByClassName("square");

  //Set starting square
  $(square[Math.floor(grid*grid/2)]).attr("data-lock", "0");

  highlight();

  centerView();

  //Gameplay starts
  $(".square").click(function() {

    var lock = $(this).attr("data-lock");
    var owner = $(this).attr("data-owner")
    if (lock == 0 &&  owner == undefined) { //Checks if empty
      $(this).attr("data-owner", player);

      //Move Notation Stuff
      clickedSquareId = $(square).index(this);
      moveNotation(clickedSquareId);

      //Update next player
      whosNext();

      //Update which squares are available/colors
      gameUpdate();

      //Check if someone won
      winCheck(0);

      //Now bots move
      for (let i = 0; i < 100; i++) {
        bot = botManager();
        if (bot === 0) {
          break;
        };
      };

      //Check if someone won
      winCheck(0);

      turn++; //turn is at end of function, else stats are incorrect
      document.getElementById("turnCounter").innerHTML = "Turn: " + Math.ceil((turn+1)/2);
    };
  });
};
