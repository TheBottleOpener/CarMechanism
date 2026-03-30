//The drive :D
//Base driving code created by Julian Scaggs, pretty much all the math and stuff to handle driving
let serial;
let latestData = 0;
let latestData2 = 0;
let latestData3 = 0;

const roady = 1;
var trees = [];
var treeCount = 20;


var position = [0,0]
var direction = 0
var newdirection = 0
var maxturning = 45

var maxacceletarion = 25
var acceleration = 0
var cur_acceleration = 0

function setup() {
  resizeCanvas(windowWidth, windowHeight);
  setupSerial();
  for (let iteration = 0; iteration < treeCount; iteration++) {
    trees.push([random(width + 100),random(height)])
    
  }

}

function preload() {
  img = loadImage('car2.png');
}

function draw() {
  newdirection = latestData;

  acceleration = map(latestData2,0,100,0,maxacceletarion);

  newdirection = min(max(newdirection,direction -  maxturning),direction + maxturning)
  if(latestData3 > 200){
    cur_acceleration = lerp(cur_acceleration, acceleration, 0.01)
  }else{
    cur_acceleration = lerp(cur_acceleration, acceleration, 0.1)
  }

  direction = lerp(direction, newdirection, max(cur_acceleration / (maxacceletarion * 4),0))

  var rad = direction * (PI/180)
  var direction_vec = [cur_acceleration * cos(rad), cur_acceleration * sin(rad)]


  position[0] += direction_vec[0]
  position[1] += direction_vec[1]


  background("green")

  //trees
  trees.forEach(element => {
    fill("brown")
    circle(wrap(element[0] + position[0],0,width + 100),wrap(element[1] + position[1],0,height + 100),10)
  });

  //road
  fill("black")
  strokeWeight(180);
  let newroady = wrap(roady + position[1],-140,height + 140)
  line(0,newroady,width,newroady)
  strokeWeight(2)

  let lineLengths = 100
  let startPos = wrap(position[0],0,lineLengths*2) - lineLengths

  while(startPos < width){
    fill("yellow")
    stroke("yellow")
    line(startPos,newroady,startPos + lineLengths,newroady)
    startPos += lineLengths * 2
  }
  stroke("black")

  //car
  var shift_vec = [-25 * sin(rad),25 * cos(rad)]

  fill("gray")

  translate(width/2 - shift_vec[0], height/2 - shift_vec[1])
  rotate(rad)
  img.resize(130,100);
  image(img, -65, -50);
  translate(-(width/2 - shift_vec[0]), -(height/2 - shift_vec[1]))
  
  translate(0, 0)
}

function wrap(value, min, max) {
  let range = max - min
  return min + ((((value - min) % range) + range) % range);
}

function setupSerial() {
  serial = new p5.SerialPort();

  serial.list();
  serial.open('COM9');
  serial.on('data', gotData);
}

function gotData() {
  let currentString = serial.readLine();
  console.log(currentString)
  if (!currentString) return;
  currentString = currentString.trim();
  if (!currentString) return;

  let parts = currentString.split(', ');
  if (parts.length === 3) {
    let potentioVal = Number(parts[0]);
    let pressureVal = Number(parts[1]);
    let flightVal = Number(parts[2]);

    if (!isNaN(potentioVal)) latestData = potentioVal;
    if (!isNaN(pressureVal)) latestData2 = pressureVal;
    if (!isNaN(flightVal)) latestData3 = flightVal;
  }
}

// Windows resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
