$(document).ready(function() {
	var playerChoice;
	var cpuChoice;
	var playerGrids = [];
	var cpuGrids = [];
	var locations = [[100, 100], [100, 200], [100, 300], 
					[200, 100], [200, 200], [200, 300],
					[300, 100], [300, 200], [300, 300]];
	/* canvas related stuff should be in document ready, or place at the end
	of the body in index.html */
	var grid = document.querySelector("#grid");
	var ctx = grid.getContext("2d");

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

	if (playerChoice === "X"){
			var playerColor = "#851818";
			var cpuColor = "#013636";
		} else {
			var playerColor = "#013636";;
			var cpuColor = "#851818";
	}

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

			if (locations.length){
				index = cpuPlay(locations);
				ctx.fillStyle = cpuColor;
				ctx.fillText(cpuChoice, locations[index][0], locations[index][1]);
				cpuGrids.push(locations.splice(index, 1));
			}
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
	})
})

function findIndex(array, value){
	for (var j = 0; j < array.length; j++){
		if (value[0] == array[j][0]){
			if (value[1] == array[j][1]){
				return j;
			}
		}
	}
}

function cpuPlay(locations){
	var index = Math.floor(Math.random() * locations.length);
	return index;
}