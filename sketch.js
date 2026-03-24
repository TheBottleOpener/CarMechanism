//The drive :D
//Base driving code created by Julian Scaggs, pretty much all the math and stuff to handle driving

const roady = 1;
var trees = [];
var treeCount = 20;


var position = [0,0]
var direction = 0
var newdirection = 0
var maxturning = 45

var maxacceletarion = 10
var acceleration = 0
var cur_acceleration = 0

var turningLeft = false;
var turningRight = false;
var accelerating = false;


function setup() {
  resizeCanvas(windowWidth, windowHeight);
  for (let iteration = 0; iteration < treeCount; iteration++) {
    trees.push([random(width + 100),random(height)])
    
  }

}

function draw() {
  if (accelerating){
    acceleration = maxacceletarion
  } else {
    acceleration = 0
  }

  if (turningLeft){
    newdirection -= 2
  }
  if (turningRight){
    newdirection += 2
  }

  newdirection = min(max(newdirection,direction -  maxturning),direction + maxturning)

  cur_acceleration = lerp(cur_acceleration, acceleration, 0.1)

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
  let newroady = wrap(roady + position[1],0,height + 100)
  line(0,newroady,width,newroady)
  strokeWeight(2)

  let lineLengths = 100
  let startPos = wrap(position[0],0,lineLengths*2) - lineLengths

  console.log(startPos)
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
  rect(0, 0, 100, 50)
  
}

function wrap(value, min, max) {
  let range = max - min
  return min + ((((value - min) % range) + range) % range);
}

function keyPressed(){
    if (key === "a"){
      turningLeft = true
    }
    if (key === "d"){
      turningRight = true
    }
    if (key === "w"){
      accelerating = true
    }
}

function keyReleased(){
    if (key === "a"){
      turningLeft = false
    }
    if (key === "d"){
      turningRight = false
    }
    if (key === "w"){
      accelerating = false
    }
}

// Windows resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}