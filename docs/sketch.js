let redSlider, greenSlider, blueSlider;
let brushSize = 2;

function setup() {
  createCanvas(600, 600);
  background(242, 234, 191);

  //draw an area for the instructions
  fill(189, 194, 184);
  noStroke();
  rect(0,0,600,100);

  //disable the default context menu for the canvas
  canvas = document.querySelector('canvas');
  canvas.addEventListener('contextmenu',(e) => e.preventDefault());
  
  //text instructions
  fill(100);
  textSize(14);
  text(`Press 's' or 'm' or 'l' for small, medium, or large brush size`,20,30);
  text(`Eraser: press 'e'`, 20, 50);
  text(`Clear canvas: press 'c'`, 20, 70);

  //create sliders for red, green and green color:
  redSlider = createSlider(0,255,127);
  redSlider.position(600,0);
  redSlider.size(100);

  greenSlider = createSlider(0,255,127);
  greenSlider.position(600,40);
  greenSlider.size(100);
  
  blueSlider = createSlider(0,255,127);
  blueSlider.position(600,80);
  blueSlider.size(100);

  //add labels to sliders
  noStroke();

  fill(255,0,0);
  textSize(15);
  text(`red:`,550,15);

  fill(0,255,0);
  textSize(15);
  text(`green:`,550,55);

  fill(0,0,255);
  textSize(15);
  text(`blue:`,550,95);
}

function draw() {
  if (mouseIsPressed){
    if (key == 'e'){ //eraser
      drawCircle();
    } else {
      drawLine();
    } 
  } else if (key == 'c'){
    clearCanvas();
  } 
}


function keyPressed(){
  if (key == 's'){
    brushSize = 2;
  } else if (key == 'm'){
    brushSize = 4;
  } else if (key == 'l'){
    brushSize = 6;
  } 
}


function drawCircle(){
    noStroke();
    fill(242, 234, 191); //match the background colour
    circle(mouseX, mouseY,50); 
}

function colour(){
  let red = redSlider.value();
  let green = greenSlider.value();
  let blue = blueSlider.value();
  stroke(red,green,blue);
  strokeWeight(brushSize);
}

function drawLine(){
      colour(); //set the colour 
      line(pmouseX,pmouseY,mouseX,mouseY);
}

function clearCanvas(){
  background(242, 234, 191);

  //draw an area for the instructions
  fill(189, 194, 184);
  noStroke();
  rect(0,0,600,100)

  //text instructions
  fill(100);
  textSize(14);
  text(`Press 's' or 'm' or 'l' for small, medium, or large brush size`,20,30);
  text(`Eraser: press 'e'`, 20, 50);
  text(`Clear canvas: press 'c'`, 20, 70);

  //add labels to sliders
  noStroke();

  fill(255,0,0);
  textSize(15);
  text(`red:`,550,15);

  fill(0,255,0);
  textSize(15);
  text(`green:`,550,55);

  fill(0,0,255);
  textSize(15);
  text(`blue:`,550,95);
}