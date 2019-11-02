//create two arrays for current and next generation
let arr = [];
let nextArr = [];
//define starting size
let rows = 20;
let cols = rows*2;
let generations;
let liveCells;
let grid = document.getElementById("grid");
let live = document.getElementById("live");
let gens = document.getElementById("gens");
window.onload = () => {drawTable();}

let drawTable = () => {
    generations = 1;
    liveCells = 0;
    gens.innerHTML = generations;
    //fill array randomly with 0s and 1s
	for (let i = 0; i < rows; i++) {arr[i] = Array.from({length: cols}, () => Math.floor(Math.random() * 2));}
    //generate empty 2Darray for next generation
    for (let i = 0; i < rows; i++) {nextArr[i] = Array.from({length: cols});}
    //if grid has any children, remove them
    while(grid.hasChildNodes())
        {
           grid.removeChild(grid.firstChild);
        }
    //draw table according to array size
	for (let i = 0; i < rows; i++){
		let tablerow = document.createElement("tr");
		grid.appendChild(tablerow);
		for (let j = 0; j < cols; j++){
			let cell = document.createElement("td");
			tablerow.appendChild(cell);
			if (arr[i][j] == 1) {
				cell.setAttribute("id", "alive");
                live.innerHTML = ++liveCells;
			}else{
				cell.setAttribute("id", "dead");
			}
		}
	}
}
let nextGeneration = () => {
    //check neighbouring cells
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            let sum = 0;
            for (let x = -1;x < 2; x++){
                for(let y = -1; y < 2; y++){
                    //if current cell is on the edge, then check the cell on the other edge
                    let row = (x + i + rows) % rows;
                    let col = (y + j + cols) % cols;
                    sum += arr[row][col];
                }   
            }
            //substract the value of current cell from sum (we only want the neighbours' values)
            sum -= arr[i][j];
            //rules for the next generation
            if (arr[i][j] == 0 && sum == 3){
                nextArr[i][j] = 1;
                grid.rows[i].cells[j].setAttribute("id", "born");
                live.innerHTML = ++liveCells;
            }else if (arr[i][j] == 1 && (sum < 2 || sum > 3)){
                nextArr[i][j] = 0;
                grid.rows[i].cells[j].setAttribute("id", "died");
                live.innerHTML = --liveCells;
            }else if (arr[i][j] == 1 && (sum == 2 || sum == 3)){
                nextArr[i][j] = arr[i][j];
                grid.rows[i].cells[j].setAttribute("id", "alive");
            }else if (arr[i][j] == 0 && sum != 3){
                nextArr[i][j] = arr[i][j];
                grid.rows[i].cells[j].setAttribute("id", "dead");
            }
        }
    }
    //copy the next generation array to original array
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            arr[i][j] = nextArr[i][j];
        }
    }
}
//loop to make it alive 
let continueAnimation = false;
let tick = () => {
    if(continueAnimation){
    let fps = 10; //set speed on animation
        setTimeout(function(){
            nextGeneration();
            myReq = requestAnimationFrame(tick);
        }, 1000/fps);
    }
    //add generation to counter
    gens.innerHTML = ++generations;
}
//functions for buttons
let start = () => {continueAnimation = true; tick();}
let stop = () => {continueAnimation = false; tick();}
let setSize = (r, c) => {rows = r; cols = c; drawTable()}
document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("small").addEventListener("click", function() {setSize(20, 40)});
document.getElementById("medium").addEventListener("click", function() {setSize(40, 80)});
document.getElementById("large").addEventListener("click", function() {setSize(50, 100)});
document.getElementById("random").addEventListener("click", function() {drawTable()});