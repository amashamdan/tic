$(document).ready(function() {
	/* The two variables below store the choice of the player and CPU (X or O) */
	var playerChoice;
	var cpuChoice;
	/* The following two variables store the color for player and CPU, X is red,
	and O is green. */
	var playerColor;
	var cpuColor;
	/* The next two variables store where the player and CPU have placed their letters
	on the grid (each placed letter has two coordinates stored in a sub-array.) */
	var playerGrids = new Array;
	var cpuGrids = new Array;
	/* This array holds the available squares on the grid. Initially no letter is
	placed so all squares are available. */
	var locations = [[100, 100], [100, 200], [100, 300], 
					[200, 100], [200, 200], [200, 300],
					[300, 100], [300, 200], [300, 300]];
	/* canvas related stuff should be in document ready, or place at the end
	of the body in index.html */
	var grid = document.querySelector("#grid");
	var ctx = grid.getContext("2d");

	/* A call to initializeGrid function with ctx passed as its argument. */
	initializeGrid(ctx);

	/* A function to handle a mouse click on the grid. */
	$("#grid").click(function(e) {
		/* The next two lines store the location of the mouse click relative to the
		location of the grid. This is needed to properly place a letter on the grid
		when a square is clicked.
		offset() Get the current coordinates of the first element in the set of 
		matched elements, relative to the document.*/
		var clickedX = e.pageX - $("#grid").offset().left;
		var clickedY = e.pageY - $("#grid").offset().top;

		/* The following for loop specifies the x coordinate of the point where the
		letter should be placed. We don't want to place the letter exactly where the
		mouse was clicked, we rather want that to happen in the center of the clicked
		square. */
		for (i in locations){
			/* For each availabel square in locations, we check the x coordinate and
			compare it to clicked x coordinate. Since each square is 100px wide, if
			the difference is less than 50, it means the the square is found, the
			x coordinate of that square is saved in x and break exits the loop. */
			if (Math.abs(locations[i][0] - clickedX) < 50) {
				var x = locations[i][0];
				break;
			}
		}

		for (i in locations){
			if (Math.abs(locations[i][1] - clickedY) < 50) {
				var y = locations[i][1];
				break;
			}
		}
	
		/* A call to findIndex with locations array and the detected x and y coordinates
		as arguments. The result is stored in indexInLocation. The call determines if
		[x,y] is available in locations (empty square), if so the letter is placed,
		if not, nothing happens and the computer waits for a new click. */
		var indexInLocation = findIndex(locations, [x,y]);
		/* Letter is placed if findIndex returns a number or zero */
		if (indexInLocation || indexInLocation === 0){
			/* The color of text in canvas is changed to the player's color. */
			ctx.fillStyle = playerColor;
			/* The letter is places on the grid using x and y coordinates. */
			ctx.fillText(playerChoice, x, y);
			/* The index of the element holding the x and y coordinates of the placed
			letter is found in locations array using findIndex function. */
			var index = findIndex(locations, [x,y]);
			/* The coordinates of the letter are removed from locations array (since
			it's not availabel any more) and moved to playerGrids array (since now
			it's occupied by the player). */
			playerGrids.push(locations.splice(index, 1));
			/* If the player has 3 or more squares occupied, the following executes: */
			if (playerGrids.length >= 3){
				/* A call to checkWin with playerGrids as argument is made to check
				if the player has a winning combination. If the player has a winning
				combination, the results stored in winStatus, if no win, nothing
				is returned and winStatus is undefined. */
				var winStatus = checkWin(playerGrids);
				if  (winStatus){
					/* If the player wins, the winning sequence (coordinates of the
					three winning squares) is stored in winning array, and win status
					(row, colomn or diagonal) is stored in winWay */
					var winningArray = winStatus[0];
					var winWay = winStatus[1];
					/* The function announceWin is called to announce the player has won. */
					announceWin("Player", winningArray, winWay, ctx, playerColor);
					/* return used to exit function and prevent CPU from playing. */
					return;
				}
			}

			/* If locations length is zero, it means CPU has no more squares available. */
			if (locations.length){
				/* cpuPlay is called and return the index in locations of the square
				where the cpu will place its letter. */
				index = cpuPlay(locations, playerGrids, cpuGrids);
				/* The remainder is the same as what happens in player's case above.
				MAYBE REFACTOR A BIT! */
				ctx.fillStyle = cpuColor;
				ctx.fillText(cpuChoice, locations[index][0], locations[index][1]);
				cpuGrids.push(locations.splice(index, 1));
				if (cpuGrids.length >= 3){
					var winStatus = checkWin(cpuGrids);
					if (winStatus){
						var winningArray = winStatus[0];
						var winWay = winStatus[1];
						announceWin("CPU", winningArray, winWay, ctx, cpuColor);
						return;		
					}
				}
			}
		}

		/* If locations length is zero, means game is over. This statement is reached
		if the game is a tie, winner class's html is modified accordingly and win-message
		div is shown on display. */
		if (locations.length == 0) {
			$(".winner").html("It's a tie!");
			$(".win-message").fadeToggle();
		}

	})

	/* X and O buttons click handler */
	$(".choice").click(function() {
		/* The player's choice is stored using the id of the clicked button. */
		playerChoice = $(this).attr("id");
		/* CPU is assigned the other letter */
		if (playerChoice === "X") {
			cpuChoice = "O";
		} else {
			cpuChoice = "X";
		}
		/* The message showing the welcome message is faded out. */
		$(".message").fadeOut();

		/* Player and CPU are assigned corresponding colors, X is red and O is green. */
		if (playerChoice == "X"){
			playerColor = "#851818";
			cpuColor = "#013636";
		} else {
			playerColor = "#013636";;
			cpuColor = "#851818";
		}
	})
	
	/* The New Game button handler. */
	$(".new-game").click(function() {
		/* The message annoucing a win or a tie is faded out. */
		$(".win-message").fadeToggle();
		/* initializeGrid is called again to clear the grid. */
		initializeGrid(ctx);
		/* locations, playerGrids and cpuGrids are reset to start the new game. */
		locations = [[100, 100], [100, 200], [100, 300], 
					[200, 100], [200, 200], [200, 300],
					[300, 100], [300, 200], [300, 300]];
		playerGrids = [];
		cpuGrids = [];
	})
})

/* initializeGrid function with ctx as its argument. */
function initializeGrid(ctx) {
	/* cleaRect clears the canvas from everything. */
	ctx.clearRect(0, 0, 400, 400);
	/* The path for drawing the grid is specified */
	ctx.beginPath();
	ctx.moveTo(150, 50);
	ctx.lineTo(150, 350);
	ctx.moveTo(250, 50);
	ctx.lineTo(250, 350);
	ctx.moveTo(50, 150);
	ctx.lineTo(350, 150);
	ctx.moveTo(50, 250);
	ctx.lineTo(350, 250);
	/* line width of the grid is set. */
	ctx.lineWidth = 2;
	/* The color of the grid is set. */
	ctx.strokeStyle = '#666666';
	/* The grid is drawn. */
	ctx.stroke();
	/* The font and alignment setting for the letters are set. */
	ctx.font = "40pt Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
}

/* findIndex function takes an array and locates the index of the given value.
NOTE THAT VALUE in an array. indexOf doesn't work in this case because value is an
array. */
function findIndex(array, value){
	/* Loop through each element in the array. */
	for (var j = 0; j < array.length; j++){
		/* If the x coordinates of the array element and value match, y coordinate is
		then checked, once i coordinate is found, the index j is returned. Note that
		the function may not return anything (for example if the user clicks a square
		already occupied by another letter.) */
		if (value[0] == array[j][0]){
			if (value[1] == array[j][1]){
				return j;
			}
		}
	}
}

/* cpuPlay function returns the index of the CPU's next sqaure. This is where CPU's 
AI is done. */
function cpuPlay(locations, playerGrids, cpuGrids){
	/* In the next few lines, cpuGrids and playerGrids are copied to test array.
	for loops where used because setting cpuTest = cpuGrids will have both referring
	to same array. altering test array would change cpuGrids which messes up the game. */
	var cpuTest = [];
	var playerTest = [];
	for (var i in cpuGrids) {
		cpuTest.push(cpuGrids[i]);
	}
	for (var i in playerGrids) {
		playerTest.push(playerGrids[i]);
	}

	/* First, if the player has less than two letters places (only one), the CPU
	index is chosen randomly.. */
	if (playerGrids.length < 2) {
		var index = Math.floor(Math.random() * locations.length);
		return index;
	}

	/* Next, a check is made to see if the cpu can win the game. For that the cpu
	should have at least two letters placed. */
	if (cpuGrids.length >= 2) {
		for (var i in locations) {
			/* cpuTest has the locations of all placed cpu letters, in this loop,
			each element in locations array is added to cpuTest and then checked (by
			calling checkWin) if it can produce a cpu win. */
			cpuTest.push([locations[i]]);
			var testResult = checkWin(cpuTest);
			/* if something is returned from checkWin, it means the current element
			in locations will produce a cpu win, and the index is returned. */
			if (testResult) {
				return i;
			}
			/* If nothing is returned from cpuTestm it means that the elements won't
			produce a win, and the element is removed from cpuTest. */
			cpuTest.pop();
		}
	}

	/* Next, the code checks if the user can win the game on the next move. */
	if (playerGrids.length >= 2) {
		for (var i in locations) {
			/* Every element in locations is added to playerTest to see if any availabe
			squares can win the game for the user in the following move. */
			playerTest.push([locations[i]]);
			var testResult = checkWin(playerTest);
			/* If the player can win in the following move, the index of the winner square
			is returned so that the CPU can place a letter there and prevent the player
			from winning. */
			if (testResult) {
				return i;
			}
			/* The element is removed if it cannot produce a player's win. */
			playerTest.pop();
		}
	}
	// If cpu or player won't win, an index is returned randomly.
	return Math.floor(Math.random() * locations.length);
}

/* The checkWin function checks for 4 scenarios, row completion, colomn completion,
and two diagonal completions. The arguments is either cpuGrids or playerGrids. */
function checkWin(grid){
	/* First a row win is checked, for a row win, there should be at least three
	elements having the same y coordinate. The for loop loops through input grid (
	cpuGrids or playerGrids), and for each element checks if there are at least two
	elements having the same y coordinate. */
	for (var i in grid) {
		/* The counter is used to count how many elements have the same y coordiante
		as the element under inspection. (reset in each loop) */
		var horizontal = 1;
		/* An array storing the elements having the same y coordinate as the inspected
		element. */
		var horElements = [];
		/* The inspected element is pushed to the horElements array. */
		horElements.push(grid[i][0]);
		/* Each element is checked against the elements from the outer for loop. */
		for (var j in grid){
			/* NOTE THE EXTRA INDEX WHEN CALLING GRID BELOW, this indicates a three
			dimensional matrix where we expect two!. This is because splice which is 
			used to push coordinates into the grid returns an array not an element. */
			if (j != i && grid[i][0][1] == grid[j][0][1]){
				/* j!=i means we don't want to compare the element to itself. if
				the j element and i element have the same y coordinate, the j element
				is pushed horElements and horizontal is incremented. */
				horizontal++;
				horElements.push(grid[j][0]);
				/* If horizontal is 3, we have a row completion. */
				if (horizontal == 3){
					/* The winning sequence and 'horizontal' are pushed. 'horizontal'
					is pushed because it's used later to make it easier to draw the
					line over the winning sequnce. */
					return [[horElements], "horizontal"];
				}
			}
		}
	}
	/* Colomn win (three points with same x coordinate), similar to row win except 
	x coordinates are checked instead of y. */ 
	for (var i in grid) {
		var vertical = 1;
		var verElements = [];
		verElements.push(grid[i][0]);
		for (var j in grid){
			if (j != i && grid[i][0][0] == grid[j][0][0]){
				vertical++;
				verElements.push(grid[j][0]);
				if (vertical == 3){
					return [[verElements], "vertical"];
				}
			}
		}
	}

	/* In the first diagonal win scenario (negative slope), each element in the 
	winning sequence has equal x and y coordinates. These are located and pushed
	to diaElements array. Once three diagonal elements are found, they're returned. */
	var diagonal = 0;
	var diaElements = [];
	for (var i in grid){
		if (grid[i][0][0] == grid[i][0][1]) {
			diagonal++;
			diaElements.push(grid[i][0]);
			if (diagonal == 3) {
				return [[diaElements], "diagonal"];
			}
		}
	}
	
	/* In the second diagonal win scenario (positive slope), the points are defined
	and looked up. */
	var invDiagonal = 0;
	for (var i in grid){
		if ((grid[i][0][0] == 200 && grid[i][0][1] == 200) ||
			(grid[i][0][0] == 300 && grid[i][0][1] == 100) ||
			(grid[i][0][0] == 100 && grid[i][0][1] == 300)){
			invDiagonal++;
			if (invDiagonal == 3){
				return [[[100, 300], [200, 200], [300, 100]], "invDiagonal"];
			}
		}
	}
}

/* This function draws a line over the winning sequence, and displays and the win
message. */
function announceWin(winner, winningArray, winWay, ctx, color) {
	/* The line color is set to the winner's color. */
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	/* The path is started, and completed in one of the if statements below. */
	ctx.beginPath();
	/* If the win is horizontal, the y coordinate of first element of the winning
	sequqnce is found and a line is drawn from left to right. */
	if (winWay == "horizontal") {	
		ctx.moveTo(50, winningArray[0][0][1]);
		ctx.lineTo(350, winningArray[0][0][1]);
		ctx.stroke();
	/* If the win is vertical, the x coordinate of first element of the winning
	sequqnce is found and a line is drawn from top to bottom. */
	} else if (winWay == "vertical") {
		ctx.moveTo(winningArray[0][0][0], 50);
		ctx.lineTo(winningArray[0][0][0], 350);
		ctx.stroke();
	/* If the win is diagonal (negative slope), the line is drawn from top left corner
	to bottom right corner. */		
	} else if (winWay == "diagonal") {
		ctx.moveTo(50, 50);
		ctx.lineTo(350, 350);
		ctx.stroke();
	/* If the win is diagonal (positive slope), the line is drawn from top right corner
	to bottom left corner. */
	} else if (winWay == "invDiagonal") {
		ctx.moveTo(350, 50);
		ctx.lineTo(50, 350);
		ctx.stroke();
	}

	/* The contents of the win message is modified to announce the winner and the
	win-message is faded in. */
	$(".winner").html("The " + winner + " Won!");
	$(".win-message").fadeToggle();
}