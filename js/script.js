$(document).ready(function() {
	var playerChoice;
	var cpuChoice;
	var playerColor;
	var cpuColor;
	var playerGrids = new Array;
	var cpuGrids = new Array;
	var locations = [[100, 100], [100, 200], [100, 300], 
					[200, 100], [200, 200], [200, 300],
					[300, 100], [300, 200], [300, 300]];
	/* canvas related stuff should be in document ready, or place at the end
	of the body in index.html */
	var grid = document.querySelector("#grid");
	var ctx = grid.getContext("2d");

	initializeGrid(ctx);

	$("#grid").click(function(e) {
		var clickedX = e.pageX - $("#grid").position().left - 200;
		var clickedY = e.pageY - $("#grid").position().top;

		for (i in locations){
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
	
		//checks if the clicked sqaure already has a letter
		var indexInLocation = findIndex(locations, [x,y]);
		if (indexInLocation || indexInLocation === 0){
			ctx.fillStyle = playerColor;
			ctx.fillText(playerChoice, x, y);
			var index = findIndex(locations, [x,y]);
			playerGrids.push(locations.splice(index, 1));
			if (playerGrids.length >= 3){
				var winStatus = checkWin(playerGrids);
				if  (winStatus){
					var winningArray = winStatus[0];
					var winWay = winStatus[1];
					announceWin("Player", winningArray, winWay, ctx, playerColor);
					// MAY NOT BE NEEDED ANYMORE
					return;
				}
			}

			if (locations.length){
				index = cpuPlay(locations, playerGrids, cpuGrids);
				ctx.fillStyle = cpuColor;
				ctx.fillText(cpuChoice, locations[index][0], locations[index][1]);
				cpuGrids.push(locations.splice(index, 1));
				if (cpuGrids.length >= 3){
					var winStatus = checkWin(cpuGrids);
					if (winStatus){
						var winningArray = winStatus[0];
						var winWay = winStatus[1];
						announceWin("CPU", winningArray, winWay, ctx, cpuColor);
						// MAY NOT BE NEEDED ANYMORE
						return;		
					}
				}
			}
		}

		if (locations.length == 0) {
			$(".winner").html("It's a tie!");
			$(".win-message").fadeToggle();
		}

	})

	$(".choice").click(function() {
		playerChoice = $(this).attr("id");
		if (playerChoice === "X") {
			cpuChoice = "O";
		} else {
			cpuChoice = "X";
		}
		$(".message").fadeOut();

		if (playerChoice == "X"){
			playerColor = "#851818";
			cpuColor = "#013636";
		} else {
			playerColor = "#013636";;
			cpuColor = "#851818";
		}
	})
	
	$(".new-game").click(function() {
		$(".win-message").fadeToggle();
		initializeGrid(ctx);
		locations = [[100, 100], [100, 200], [100, 300], 
					[200, 100], [200, 200], [200, 300],
					[300, 100], [300, 200], [300, 300]];
		playerGrids = [];
		cpuGrids = [];
	})
})

function initializeGrid(ctx) {
	ctx.clearRect(0, 0, 400, 400);
	ctx.beginPath();
	ctx.moveTo(150, 50);
	ctx.lineTo(150, 350);
	ctx.moveTo(250, 50);
	ctx.lineTo(250, 350);
	ctx.moveTo(50, 150);
	ctx.lineTo(350, 150);
	ctx.moveTo(50, 250);
	ctx.lineTo(350, 250);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#666666';
	ctx.stroke();
	ctx.font = "40pt Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
}

function findIndex(array, value){
	for (var j = 0; j < array.length; j++){
		if (value[0] == array[j][0]){
			if (value[1] == array[j][1]){
				return j;
			}
		}
	}
}

function cpuPlay(locations, playerGrids, cpuGrids){
	var cpuTest = [];
	var playerTest = [];
	for (var i in cpuGrids) {
		cpuTest.push(cpuGrids[i]);
	}
	for (var i in playerGrids) {
		playerTest.push(playerGrids[i]);
	}
	if (playerGrids.length < 2) {
		var index = Math.floor(Math.random() * locations.length);
		return index;
	}
	if (cpuGrids.length >= 2) {
		for (var i in locations) {
			cpuTest.push([locations[i]]);
			var testResult = checkWin(cpuTest);
			if (testResult) {
				return i;
			}
			cpuTest.pop();
		}
	}
	if (playerGrids.length >= 2) {
		for (var i in locations) {
			playerTest.push([locations[i]]);
			var testResult = checkWin(playerTest);
			if (testResult) {
				return i;
			}
			playerTest.pop();
		}
	}
	// if cpu or player won't win, return randomly.
	return Math.floor(Math.random() * locations.length);
}

function checkWin(grid){
	// Row win (three points with same y cooridnate)
	for (var i in grid) {
		var horizontal = 1;
		var horElements = [];
		horElements.push(grid[i][0]);
		for (var j in grid){
			/* NOTE THE EXTRA INDEX WHEN CALLING GRID BELOW, this indicates a three
			dimensional matrix where we expect two!. This is because splice which is 
			used to push coordinates into the grid returns an array not an element. */
			if (j != i && grid[i][0][1] == grid[j][0][1]){
				horizontal++;
				horElements.push(grid[j][0]);
				if (horizontal == 3){
					return [[horElements], "horizontal"];
				}
			}
		}
	}
	// Colomn win (three points with same x coordinate)
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
	// Diagonal win
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
	// invDiagonal win
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

function announceWin(winner, winningArray, winWay, ctx, color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	ctx.beginPath();

	if (winWay == "horizontal") {	
		ctx.moveTo(50, winningArray[0][0][1]);
		ctx.lineTo(350, winningArray[0][0][1]);
		ctx.stroke();
	} else if (winWay == "vertical") {
		ctx.moveTo(winningArray[0][0][0], 50);
		ctx.lineTo(winningArray[0][0][0], 350);
		ctx.stroke();		
	} else if (winWay == "diagonal") {
		ctx.moveTo(50, 50);
		ctx.lineTo(350, 350);
		ctx.stroke();
	} else if (winWay == "invDiagonal") {
		ctx.moveTo(350, 50);
		ctx.lineTo(50, 350);
		ctx.stroke();
	}

	$(".winner").html("The " + winner + " Won!");
	$(".win-message").fadeToggle();
}