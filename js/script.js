$(document).ready(function() {
	var playerChoice;	
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

		ctx.font = "40pt Arial";
		ctx.textAlign = "center";
		if (playerChoice === "X"){
			ctx.fillStyle = "#851818";
		} else {
			ctx.fillStyle = "#013636";
		}
		ctx.textBaseline = "middle";
		ctx.fillText(playerChoice, x, y);
	})

	$(".choice").click(function() {
		playerChoice = $(this).attr("id");
		$(".message").fadeOut();
	})
})

/*
var x;
var y;
if (e.pageX || e.pageY) { 
  x = e.pageX;
  y = e.pageY;
}
else { 
  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
} 
x -= grid.offsetLeft;
y -= grid.offsetTop;
console.log(x);
console.log(y);

*/