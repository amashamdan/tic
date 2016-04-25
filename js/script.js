$(document).ready(function() {
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
		var x = e.pageX - $("#grid").position().left - 200;
		var y = e.pageY - $("#grid").position().top;
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