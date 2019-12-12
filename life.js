//create two arrays for current and next generation
let arr = [];
let nextArr = [];
//define starting size
let rows = 20;
let cols = rows;
let generations;
let liveCells;
let fps = 10;  //set speed of animation
let t0, t1, tt = 0, c; //variables for measuring efficiency
let grid = document.getElementById("grid");
let live = document.getElementById("live");
let gens = document.getElementById("gens");
let perf = document.getElementById("perf");
window.onload = () => {drawTable("random");}

let drawTable = (r) => {
    generations = 0;
    liveCells = 0;
    tt = 0; 
    live.innerHTML = liveCells;
    gens.innerHTML = generations;
    perf.innerHTML = tt.toFixed(2) + " ms"
    if(r == "random"){
    //fill array randomly with 0s and 1s
    for (let i = 0; i < rows; i++) {arr[i] = Array.from({length: cols}, () => Math.floor(Math.random() * 2));}
    } else {
    //fill array with zeros
    for (let i = 0; i < rows; i++) {arr[i] = Array.from({length: cols}, () => 0);}
    }
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
            cell.addEventListener("click", function(e) {drawCells(e, i, j)});
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
    c = 0; //number of comparisons
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
                live.innerHTML = liveCells++;
                c++; //count the number of if-else if checks
            }else if (arr[i][j] == 1 && (sum < 2 || sum > 3)){
                nextArr[i][j] = 0;
                grid.rows[i].cells[j].setAttribute("id", "died");
                live.innerHTML = --liveCells;
                c += 2;
            }else if (arr[i][j] == 1 && (sum == 2 || sum == 3)){
                nextArr[i][j] = arr[i][j];
                grid.rows[i].cells[j].setAttribute("id", "alive");
                c += 3;
            }else if (arr[i][j] == 0 && sum != 3){
                nextArr[i][j] = arr[i][j];
                grid.rows[i].cells[j].setAttribute("id", "dead");
                c += 4;
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
    //if (generations == 30) continueAnimation = false; //break for measurements
    if(continueAnimation){
        setTimeout(function(){
            t0 = performance.now();
            nextGeneration();
            t1 = performance.now();
            tt += (t1 -t0); //get time spent on calculating next generations
            perf.innerHTML = tt.toFixed(2) + " ms"
            myReq = requestAnimationFrame(tick);
        }, 1000/fps);
    }
    //add generation to counter
    gens.innerHTML = generations++;
}
//function to color/uncolor cells on click
let drawCells = (e, i, j) => {
    let cell = e.target;
    let idtype;
    if(cell.getAttribute("id") == "alive") {
        idtype = "dead";
        arr[i][j] = 0;
        live.innerHTML = --liveCells;
       } else {
        idtype = "alive";
        arr[i][j] = 1;
        live.innerHTML = ++liveCells;
       }
    cell.setAttribute("id", idtype);
}
//set speed according to slider value
let getRangeValue = (val) => {
    fps = val;
}
//functions for buttons
let start = () => {continueAnimation = true; tick();}
let stop = () => {continueAnimation = false; tick();}
let setSize = (n) => {
    if(!Number.isInteger(n)) {
        alert("Give size as an integer.");
    } else {
    rows = n; cols = n; drawTable()}
}
//adding eventlisteners
document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("setsize").addEventListener("click", function() {let n = parseInt(document.getElementById("size").value); setSize(n)});
document.getElementById("clear").addEventListener("click", function() {drawTable()});
document.getElementById("random").addEventListener("click", function() {drawTable("random")});