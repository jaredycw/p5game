// For Character's Setting
var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isFalling;
var isRight;
var isPlummeting;
var minX;
var maxX;
var minAlert;
var maxAlert;
var startTime;
var elapsedTIme;
// For Background and the Game Elements
var trees;
var clouds;
var canyon;
var collectable;
var mountains;
var scrollPos;
var gameChar_world_x;
var game_score;
var flagpole;
var lives;
var platforms;
var slimes;
var hpCount_x;
var hpCount_y;



var tokenSize;
var fadeValue;
var fadeSpeed;
var showText;
var touchSlime;
//For Sound Variables
var backgroundSound;
var walkSound;
var jumpSound;
var coinSound;
var jumpOffSound;
var contactEnemySound;
var victorySound;

// Music was found in freesound.org
function preload()
{
    soundFormats('mp3', 'wav', 'ogg');
    //load the sounds
    //backgroundSound is from
    backgroundSound = loadSound('assets/backgroundsound.wav');
    backgroundSound.setVolume(0.1);
    //walkSound is from https://freesound.org/people/LittleRobotSoundFactory/sounds/270421/
    walkSound = loadSound('assets/walk.wav');
    walkSound.setVolume(0.2);
    //jumpSound is from https://freesound.org/people/OwlStorm/sounds/404764/
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.2);
    //coinSound is from https://freesound.org/people/Leszek_Szary/sounds/146723/
    coinSound = loadSound('assets/coin.wav');
    coinSound.setVolume(0.2);
    //jumpOffSound is from https://freesound.org/people/egomassive/sounds/536786/
    jumpOffSound = loadSound('assets/jumpoff.ogg');
    jumpOffSound.setVolume(0.2);
    //contactEnemySound is from https://freesound.org/people/Jamius/sounds/41530/
    contactEnemySound = loadSound('assets/slimeattack.wav');
    contactEnemySound.setVolume(0.2);
    //victorySound is from https://freesound.org/people/FunWithSound/sounds/456966/
    victorySound = loadSound('assets/victory.mp3');
    victorySound.setVolume(0.3);
}
function setup() {

    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    
    lives = 3;
    game_score = 0;
    fadeValue = 0;
    fadeSpeed = 3;
    showText = true;
    startGame();
    restart();

}

function draw() {
    background(118, 209, 244);
    drawSun();
    noStroke();
    fill(19, 142, 97);
    rect(0, floorPos_y, width, height - floorPos_y);
    fill(147, 97, 24);
    rect(0, floorPos_y +15 , width, height - floorPos_y);
       
    push();
    translate(scrollPos, 0);
    drawClouds();

    drawMountains();
    
    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    drawTrees();
    //draw the sign
    drawSign();
    
    // Draw platforms
    for (var i=0; i<platforms.length; i++){
        platforms[i].draw();
    }
    //Draw Slime
    touchSlime = false;
    for (var i = 0; i < slimes.length; i++) {
      var isInsideCanyon = checkInsideCanyon(slimes[i], canyons);

      if (!isInsideCanyon) {
        slimes[i].drawSlime();
        slimes[i].move();

        if (slimes[i].checkContact(gameChar_world_x, gameChar_y)) {
          touchSlime = true;
          contactEnemySound.play();
          break;
        }
      }
    }
    if(touchSlime && lives > 0){
        lives -= 1;
        if(lives>0){
            restart();
        }
    }
    
    //Draw Collectables
    for (var i = 0; i < collectables.length; i++) {
      if (!collectables[i].isFound) {
        var isInsideCanyon = checkInsideCanyon(collectables[i], canyons);

        if (!isInsideCanyon) {
          drawCollectable(collectables[i]);
          checkCollectable(collectables[i]);
        }
      }
    }
    renderFlagpole();
    
    pop();
  
    setting();

    if(lives < 1){
      noStroke();
      fill(100,100,100,150);
      rect(80, 225, 880, 100,25);
      textSize(36);
      textStyle(BOLD);
      textAlign(CENTER);
      fill(255);
      isPlummeting = true;
      setTimeout(function() {
        jumpOffSound.stop();
      }, 500); // Delay in milliseconds
      text("Game over. Press R to Restart.", width / 2, height / 2);
    }
    if(gameChar_world_x < minX){
            isLeft=false;
            minAlert=true;
            if(minAlert)
            {
                  noStroke();
                  fill(100,100,100,150);
                  rect(80, 225, 880, 100,25);
                  textSize(36);
                  textStyle(BOLD);
                  textAlign(CENTER);
                  noStroke();
                  fill(255);
                  text("Please Follow The Sign, Turn Right", width / 2, height / 2);
            }
    } else if (gameChar_world_x > maxX)
    {
            isRight=false;
            maxAlert=true;
            if(maxAlert)
            {
                  noStroke();
                  fill(100,100,100,150);
                  rect(80, 225, 880, 100,25);
                  textSize(36);
                  textStyle(BOLD);
                  textAlign(CENTER);
                  noStroke();
                  fill(0, 0, 0);
                  text("Please go back", width / 2, height / 2);
            }
    }
    if(flagpole.isReached){
      noStroke();
      fill(100,100,100,150);
      rect(80, 225, 880, 100,25);
      textSize(36);
      textStyle(BOLD);
      textAlign(CENTER);
      fill(255);
      text("Level complete. Press R to Restart.", width / 2, height / 2);
    }
    if (isLeft) {
        if (gameChar_x > width * 0.3) {
            gameChar_x -= 5;
        } else {
            scrollPos += 5;
        }
    }
    if (isRight) {
        if (gameChar_x < width * 0.7) {
            gameChar_x += 5;
        } else {
            scrollPos -= 5;
        }
    }
    if (flagpole.isReached == false) {
        checkFlagpole();
        
    }
    gameChar_world_x = gameChar_x - scrollPos;
    drawLifeTokens();
    drawCharacter();
    checkPlayerDie();
    
    if(isPlummeting){
        isLeft=false;
        isRight=false;
        isFalling=false;
        gameChar_y+=10;

    }
    if (gameChar_y < floorPos_y) {
        var isContact = false;
        for (var i = 0; i < platforms.length; i++){
            if (platforms[i].checkContact(gameChar_world_x, gameChar_y)) {
                isContact = true;
                break;
            }
        }
        if (!isContact) {
            gameChar_y += 2;
            isFalling = true;
        } else if(isContact){
            isFalling = false;
        }
    } 
    else {
        isFalling = false;
    }
    intro();
}
function checkInsideCanyon(object, canyons) {
  for (var j = 0; j < canyons.length; j++) {
      if (
      object.x >= canyons[j].x_pos &&
      object.x <= canyons[j].x_pos + canyons[j].width
      ) 
      {
      return true;
      }
   }
   return false;
}
function drawCharacter()
{

    if (isLeft && isFalling) {
        fill(0);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        fill(255, 255, 255);
        ellipse(gameChar_x, gameChar_y - 55, 30);

        fill(29, 29, 31);
        noStroke();
        beginShape();
        curveVertex(gameChar_x - 15, gameChar_y - 62);
        curveVertex(gameChar_x - 14, gameChar_y - 65);
        curveVertex(gameChar_x, gameChar_y - 71);
        curveVertex(gameChar_x + 5, gameChar_y - 70);
        curveVertex(gameChar_x + 14, gameChar_y - 63);
        endShape(CLOSE);

        fill(255, 255, 255);
        noStroke();
        beginShape();
        curveVertex(gameChar_x + 10, gameChar_y - 60);
        curveVertex(gameChar_x - 2, gameChar_y - 60);
        curveVertex(gameChar_x + 2, gameChar_y - 68);
        curveVertex(gameChar_x + 2, gameChar_y - 69);
        curveVertex(gameChar_x + 5, gameChar_y - 64);
        endShape(CLOSE);

        fill(29, 29, 31);
        rect(gameChar_x - 13, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x - 10, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 3, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 5, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x - 4, gameChar_y - 55, 2.6, 8);

        fill(29, 29, 31);
        rect(gameChar_x - 3, gameChar_y - 45, 6, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 25, 24, 29);

        fill(29, 29, 31);
        rect(gameChar_x - 8, gameChar_y - 18, 6, 12);
        fill(88, 88, 88);
        ellipse(gameChar_x - 6, gameChar_y - 6, 10, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 6, gameChar_y - 16, 6, 13);

        fill(88, 88, 88);
        ellipse(gameChar_x + 8, gameChar_y - 3, 10, 5);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 32, 30, 8);

        var armRotation = map(0, 0, width, -PI / -1.5, PI / -1.5);
        push();
        translate(gameChar_x - 19, gameChar_y - 26);
        rotate(armRotation);
        fill(132, 132, 132);
        ellipse(-10, 0, 6, 15);
        fill(88, 88, 88);
        ellipse(-10, 6, 12, 8);
        pop();
        
        var armRotation = map(0, 0, width, PI / 1.5, -PI / 1.5);
        push();
        translate(gameChar_x + 10, gameChar_y - 35);
        rotate(armRotation);
        fill(132, 132, 132);
        ellipse(0, 0, 6, 15);
        fill(88, 88, 88);
        ellipse(-1, 6, 12, 8);
        pop();
    } else if (isRight && isFalling) {
        
        fill(0);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        fill(255, 255, 255);
        ellipse(gameChar_x, gameChar_y - 55, 30);

        fill(29, 29, 31);
        noStroke();
        beginShape();
        curveVertex(gameChar_x - 15, gameChar_y - 62);
        curveVertex(gameChar_x - 14, gameChar_y - 65);
        curveVertex(gameChar_x, gameChar_y - 71);
        curveVertex(gameChar_x + 5, gameChar_y - 70);
        curveVertex(gameChar_x + 14, gameChar_y - 63);
        endShape(CLOSE);

        fill(255, 255, 255);
        noStroke();
        beginShape();
        curveVertex(gameChar_x + 10, gameChar_y - 60);
        curveVertex(gameChar_x - 2, gameChar_y - 60);
        curveVertex(gameChar_x + 2, gameChar_y - 68);
        curveVertex(gameChar_x + 2, gameChar_y - 69);
        curveVertex(gameChar_x + 5, gameChar_y - 64);
        endShape(CLOSE);

        fill(29, 29, 31);
        rect(gameChar_x - 12, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x - 5, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 3, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 10, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 1, gameChar_y - 55, 2.6, 8);

        fill(29, 29, 31);
        rect(gameChar_x - 3, gameChar_y - 45, 6, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 25, 24, 29);

        fill(29, 29, 31);
        rect(gameChar_x - 8, gameChar_y - 15, 6, 12);
        fill(88, 88, 88);
        ellipse(gameChar_x - 4, gameChar_y - 2, 10, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 6, gameChar_y - 18, 6, 13);

        fill(88, 88, 88);
        ellipse(gameChar_x + 10, gameChar_y - 6, 10, 5);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 32, 30, 8);

        var armRotation = map(0, 0, width, -PI / 1.3, PI / 1.3);
        push();
        translate(gameChar_x - 16, gameChar_y - 41);
        rotate(armRotation);
        fill(132, 132, 132);
        ellipse(-10, 0, 6, 15);
        fill(88, 88, 88);
        ellipse(-9, 6, 12, 8);
        pop();
        
        var armRotation = map(0, 0, width, PI / -1.3, -PI / -1.3);
        push();
        translate(gameChar_x + 15, gameChar_y - 34);
        rotate(armRotation);
        fill(132, 132, 132);
        ellipse(0, 0, 6, 15);
        fill(88, 88, 88);
        ellipse(0, 6, 12, 8);
        pop();

    } else if (isLeft) {
        fill(0);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        fill(255, 255, 255);
        ellipse(gameChar_x, gameChar_y - 55, 30);

        fill(29, 29, 31);
        noStroke();
        beginShape();
        curveVertex(gameChar_x - 15, gameChar_y - 62);
        curveVertex(gameChar_x - 14, gameChar_y - 65);
        curveVertex(gameChar_x, gameChar_y - 71);
        curveVertex(gameChar_x + 5, gameChar_y - 70);
        curveVertex(gameChar_x + 14, gameChar_y - 63);
        endShape(CLOSE);

        fill(255, 255, 255);
        noStroke();
        beginShape();
        curveVertex(gameChar_x + 10, gameChar_y - 60);
        curveVertex(gameChar_x - 2, gameChar_y - 60);
        curveVertex(gameChar_x + 2, gameChar_y - 68);
        curveVertex(gameChar_x + 2, gameChar_y - 69);
        curveVertex(gameChar_x + 5, gameChar_y - 64);
        endShape(CLOSE);

        fill(29, 29, 31);
        rect(gameChar_x - 13, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x - 10, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 3, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 5, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x - 4, gameChar_y - 55, 2.6, 8);

        fill(29, 29, 31);
        rect(gameChar_x - 3, gameChar_y - 45, 6, 2.6);

        var armRotation = map(0, 0, width, -PI / 5.5, PI / 5.5);
        push();
        translate(gameChar_x - 1, gameChar_y - 31);
        rotate(armRotation);
        fill(132, 132, 132);
        ellipse(-10, 0, 6, 15);
        fill(88, 88, 88);
        ellipse(-12, 6, 12, 8);
        pop();

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 25, 24, 29);

        fill(29, 29, 31);
        rect(gameChar_x - 8, gameChar_y - 18, 6, 12);
        fill(88, 88, 88);
        ellipse(gameChar_x - 6, gameChar_y - 6, 10, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 6, gameChar_y - 16, 6, 13);

        fill(88, 88, 88);
        ellipse(gameChar_x + 8, gameChar_y - 3, 10, 5);

        var armRotation = map(0, 0, width, PI / 4, -PI / 4);
        push();
        translate(gameChar_x + 10, gameChar_y - 24);
        rotate(armRotation);
        fill(132, 132, 132);
        ellipse(0, 0, 6, 15);
        fill(88, 88, 88);
        ellipse(0, 6, 12, 8);
        pop();

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 32, 30, 8);
    } else if (isRight) {
        fill(0);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        fill(255, 255, 255);
        ellipse(gameChar_x, gameChar_y - 55, 30);

        fill(29, 29, 31);
        noStroke();
        beginShape();
        curveVertex(gameChar_x - 15, gameChar_y - 62);
        curveVertex(gameChar_x - 14, gameChar_y - 65);
        curveVertex(gameChar_x, gameChar_y - 71);
        curveVertex(gameChar_x + 5, gameChar_y - 70);
        curveVertex(gameChar_x + 14, gameChar_y - 63);
        endShape(CLOSE);

        fill(255, 255, 255);
        noStroke();
        beginShape();
        curveVertex(gameChar_x + 10, gameChar_y - 60);
        curveVertex(gameChar_x - 2, gameChar_y - 60);
        curveVertex(gameChar_x + 2, gameChar_y - 68);
        curveVertex(gameChar_x + 2, gameChar_y - 69);
        curveVertex(gameChar_x + 5, gameChar_y - 64);
        endShape(CLOSE);

        fill(29, 29, 31);
        rect(gameChar_x - 12, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x - 5, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 3, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 10, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 1, gameChar_y - 55, 2.6, 8);

        fill(29, 29, 31);
        rect(gameChar_x - 3, gameChar_y - 45, 6, 2.6);
        
        var armRotation = map(0, 0, width, PI / 6.5, -PI / 6.5);
        push();
        translate(gameChar_x + 13, gameChar_y - 24);
        rotate(armRotation);
        fill(132, 132, 132);
        ellipse(0, 0, 6, 15);
        fill(88, 88, 88);
        pop();
        
        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 25, 24, 29);

        fill(29, 29, 31);
        rect(gameChar_x - 8, gameChar_y - 15, 6, 12);
        fill(88, 88, 88);
        ellipse(gameChar_x - 4, gameChar_y - 2, 10, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 6, gameChar_y - 18, 6, 13);

        fill(88, 88, 88);
        ellipse(gameChar_x + 10, gameChar_y - 6, 10, 5);

        var armRotation = map(0, 0, width, -PI / 5.5, PI / 5.5);

        push();

        translate(gameChar_x - 1, gameChar_y - 31);
        rotate(armRotation);
        
        fill(132, 132, 132);
        ellipse(-10, 0, 6, 15);
        fill(88, 88, 88);
        ellipse(-9, 6, 12, 8);
        pop();

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 32, 30, 8);
    } else if (isFalling || isPlummeting) {
        fill(0);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        fill(255, 255, 255);
        ellipse(gameChar_x, gameChar_y - 55, 30);

        fill(29, 29, 31);
        noStroke();
        beginShape();
        curveVertex(gameChar_x - 15, gameChar_y - 62);
        curveVertex(gameChar_x - 14, gameChar_y - 65);
        curveVertex(gameChar_x, gameChar_y - 71);
        curveVertex(gameChar_x + 5, gameChar_y - 70);
        curveVertex(gameChar_x + 14, gameChar_y - 63);
        endShape(CLOSE);

        fill(255, 255, 255);
        noStroke();
        beginShape();
        curveVertex(gameChar_x + 10, gameChar_y - 60);
        curveVertex(gameChar_x - 2, gameChar_y - 60);
        curveVertex(gameChar_x + 2, gameChar_y - 68);
        curveVertex(gameChar_x + 2, gameChar_y - 69);
        curveVertex(gameChar_x + 5, gameChar_y - 64);
        endShape(CLOSE);

        fill(29, 29, 31);
        rect(gameChar_x - 13, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x - 8, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 3, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 8, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x - 1, gameChar_y - 55, 2.6, 8);

        fill(29, 29, 31);
        rect(gameChar_x + 1, gameChar_y - 45, 6, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 25, 24, 29);

        fill(29, 29, 31);
        rect(gameChar_x - 8, gameChar_y - 16, 6, 12);
        fill(88, 88, 88);
        ellipse(gameChar_x - 5, gameChar_y - 3, 10, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 6, gameChar_y - 17, 6, 13);

        fill(88, 88, 88);
        ellipse(gameChar_x + 9, gameChar_y - 3, 10, 5);

        fill(132, 132, 132);

        ellipse(gameChar_x - 10, gameChar_y - 40, 6, 15);
        fill(88, 88, 88);
        ellipse(gameChar_x - 10, gameChar_y - 46, 12, 8);
        
        fill(132, 132, 132);
        ellipse(gameChar_x + 12, gameChar_y - 40, 6, 15);
        fill(88, 88, 88);
        ellipse(gameChar_x + 12, gameChar_y - 46, 12, 8);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 32, 30, 8);

    } else {
        fill(0);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        fill(255, 255, 255);
        ellipse(gameChar_x, gameChar_y - 55, 30);

        fill(29, 29, 31);
        noStroke();
        beginShape();
        curveVertex(gameChar_x - 15, gameChar_y - 62);
        curveVertex(gameChar_x - 14, gameChar_y - 65);
        curveVertex(gameChar_x, gameChar_y - 71);
        curveVertex(gameChar_x + 5, gameChar_y - 70);
        curveVertex(gameChar_x + 14, gameChar_y - 63);
        endShape(CLOSE);

        fill(255, 255, 255);
        noStroke();
        beginShape();
        curveVertex(gameChar_x + 10, gameChar_y - 60);
        curveVertex(gameChar_x - 2, gameChar_y - 60);
        curveVertex(gameChar_x + 2, gameChar_y - 68);
        curveVertex(gameChar_x + 2, gameChar_y - 69);
        curveVertex(gameChar_x + 5, gameChar_y - 64);
        endShape(CLOSE);

        fill(29, 29, 31);
        rect(gameChar_x - 13, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x - 8, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 3, gameChar_y - 59, 10, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 8, gameChar_y - 55, 5);

        fill(29, 29, 31);
        rect(gameChar_x - 1, gameChar_y - 55, 2.6, 8);

        fill(29, 29, 31);
        rect(gameChar_x + 1, gameChar_y - 45, 6, 2.6);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 25, 24, 29);

        fill(29, 29, 31);
        rect(gameChar_x - 8, gameChar_y - 16, 6, 12);
        fill(88, 88, 88);
        ellipse(gameChar_x - 5, gameChar_y - 3, 10, 5);

        fill(29, 29, 31);
        rect(gameChar_x + 6, gameChar_y - 17, 6, 13);

        fill(88, 88, 88);
        ellipse(gameChar_x + 9, gameChar_y - 3, 10, 5);

        fill(132, 132, 132);
        ellipse(gameChar_x - 10, gameChar_y - 24, 6, 15);
        fill(88, 88, 88);
        ellipse(gameChar_x - 10, gameChar_y - 18, 12, 8);

        fill(132, 132, 132);
        ellipse(gameChar_x + 12, gameChar_y - 24, 6, 15);
        fill(88, 88, 88);
        ellipse(gameChar_x + 12, gameChar_y - 18, 12, 8);

        fill(29, 29, 31);
        ellipse(gameChar_x + 1.5, gameChar_y - 32, 30, 8);
    }
}

function setting(){
        settingCollectable = {
                x_pos: 85,
                y_pos: 78,
                size: 55,
                isFound: false,
                rect_width: 18,
                rect_height: 4
        }
        drawCollectable(settingCollectable);
    
        stroke(255);
        strokeWeight(6);
        textSize(42);
        textAlign(CENTER);
        textStyle(BOLD);
        fill(137, 89, 3);
        text("x  ", 115, 61);
        textSize(48);
        text(game_score, 140, 65);
        text("/", 173, 67);
        text(collectables.length, 210, 65);
    
        noStroke();
        fill(255,0,0);
        ellipse(
            55,
            110,
            55,
            55
        );
        fill(128, 64, 64);
        ellipse(
            55,
            110,
            55 - 15,
            55 - 15
        );
        fill(255,255,255);
        rect(51,95,8,30);
        rect(40,105,30,8);
    
        fill(137, 89, 3);
        stroke(255);
        strokeWeight(6);
        textSize(42);
        text("x  ", 115, 122);
        
}
function intro(){
    
    if (showText) {
        fill(0, fadeValue);
        textSize(48);
        textStyle(BOLD);
        text("- Welcome -", width / 2, height / 2 - 150);
        
        fill(0, fadeValue);
        textSize(155);
        textStyle(BOLD);
        strokeWeight(5);
        fill(0, fadeValue);
        text("Coins Hunter", width / 2, height / 2 + 45);
        strokeWeight(10);
        stroke(0, fadeValue);
        fill(255, 170, 0, fadeValue);
        text("Coins Hunter", width / 2 - 8, height / 2 + 35);

        fill(0, fadeValue);
        textSize(21);
        noStroke();
        strokeWeight(0);
        text("PRESS ANY KEY TO START", width / 2, height / 2 + 180);
        text("< Mode A | Mode B >", width / 2, height / 2 + 215);
        
        // Keyboard W
        textSize(16);
        text("JUMP", 100, 420);
        
        fill(255, fadeValue);
        stroke(0, fadeValue);
        strokeWeight(2);
        rect(75, 425, 50, 50, 15);
        
        fill(0, fadeValue);
        noStroke();
        textSize(30);
        text("W", 100, 462);
        
        // Keyboard A
        textSize(16);
        text("LEFT", 40, 480);
        fill(255, fadeValue);
        stroke(0);
        rect(15, 485, 50, 50, 15);
        
        fill(0, fadeValue);
        noStroke();
        textSize(30);
        text("A", 40, 522);
        
        // Keyboard D
        textSize(16);
        text("RIGHT", 160, 480);
        fill(255, fadeValue);
        stroke(0);
        rect(135, 485, 50, 50, 15);
        
        fill(0, fadeValue);
        noStroke();
        textSize(30);
        text("D", 160, 522);
    
        // Keyboard Left Arrow
        textSize(16);
        text("LEFT", width - 100, 420);
        fill(255, fadeValue);
        stroke(0);
        rect(width - 123, 425, 50, 50, 15);
        
        fill(0, fadeValue);
        noStroke();
        textSize(30);
        text("<", width - 100, 459);
        
        // Keyboard Right Arrow
        textSize(16);
        text("RIGHT", width-40, 420);
        fill(255, fadeValue);
        stroke(0);
        rect(width-65, 425, 50, 50, 15);
        
        fill(0, fadeValue);
        noStroke();
        textSize(30);
        text(">",width-39, 459);
        
        // Keyboard Space
        fill(255, fadeValue);
        stroke(0);
        rect(width-123, 485, 108, 50, 15);
        
        fill(0, fadeValue);
        noStroke();
        textSize(21);
        text("SPACE",width-68, 518);
    }
    
    if (fadeValue < 255) {
        fadeValue += fadeSpeed;
 
    }  
}
function keyPressed() {
    if (showText) {
        showText = false;
    }
    if ((keyCode == 37 || keyCode == 65) && lives > 0) {
        isLeft = true;
        walkSound.loop();
        
    } else if ((keyCode == 39 || keyCode == 68) && lives > 0) {
        isRight = true; 
        walkSound.loop();
        
    } else if (keyCode == 32 || keyCode == 87 && gameChar_y==floorPos_y) {
        //Jumping
        if (!isFalling) {
            gameChar_y -= 130;
            jumpSound.play();
        }
    }
    //Jumping on the platforms
    for (var i=0; i<platforms.length; i++){
        if(platforms[i].checkContact(gameChar_world_x,gameChar_y)==true ){
            if(keyCode == 32 || keyCode == 87){
                gameChar_y-=130;
                jumpSound.play();
            }
        }
    }
    if (keyCode == 82) {
        if(lives < 1 || flagpole.isReached){
            lives = 3;
            game_score = 0;
            backgroundSound.stop();
            startGame();
        }
    }
    //Preventing press jump and walk sound
    //First Condition W and D
    //Second Condition W and A
    //Third Condition SPACE and RightArrow
    //Fourth Condition SPACE and LeftArrow
    //Fifth Condition SPACE and LeftArrow
    if(
        (keyIsDown(87) && keyIsDown(68)) ||
        (keyIsDown(87) && keyIsDown(65)) ||
        (keyIsDown(32) && keyIsDown(39)) ||
        (keyIsDown(32) && keyIsDown(37)) ||
        (keyIsDown(87) && keyIsDown(39)) ||
        (keyIsDown(87) && keyIsDown(37)) ||
        (keyIsDown(32) && keyIsDown(68)) ||
        (keyIsDown(32) && keyIsDown(65))
    )
    {
        walkSound.stop();    
    }
}
function keyReleased() {
    if (keyCode == 37  || keyCode == 65) {
        isLeft = false;
        walkSound.stop();
    } else if (keyCode == 39 || keyCode == 68) {
        isRight = false;
        walkSound.stop();
    }

}
function drawSign(){
    fill(212,146,4);
    rect(300,floorPos_y-60,20,60);
    rect(260,floorPos_y - 100,100,60);
    fill(0);
    rect(275, floorPos_y -75,70,10);
    triangle(
                275 + 55, floorPos_y - 86,
                275 + 80 , floorPos_y - 69,
                275 + 55, floorPos_y - 55
            );
}
function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
        fill(221, 221, 221);
        ellipse(clouds[i].x_pos - 75, clouds[i].y_pos + 5, 80, 50);
        ellipse(clouds[i].x_pos - 95, clouds[i].y_pos + 5, 80, 80);
        ellipse(clouds[i].x_pos - 115, clouds[i].y_pos + 5, 80, 50);
        fill(247, 247, 247);
        clouds[i].x_pos -= 1;
        ellipse(clouds[i].x_pos - 80, clouds[i].y_pos, 80, 50);
        ellipse(clouds[i].x_pos - 100, clouds[i].y_pos, 80, 80);
        ellipse(clouds[i].x_pos - 120, clouds[i].y_pos, 80, 50);
    }
}
function drawMountains() {

    for (var i = 0; i < moutains.length; i++) {
        fill(199, 249, 246);
        triangle(moutains[i].x_pos, moutains[i].y_pos,
            moutains[i].x_pos + 180, moutains[i].y_pos - 200,
            moutains[i].x_pos + 400, moutains[i].y_pos);
        fill(10, 86, 82);
        triangle(moutains[i].x_pos, moutains[i].y_pos,
            moutains[i].x_pos + 200, moutains[i].y_pos - 120,
            moutains[i].x_pos + 500, moutains[i].y_pos);
        fill(10, 124, 124);
        triangle(moutains[i].x_pos, moutains[i].y_pos,
            moutains[i].x_pos + 300, moutains[i].y_pos - 100,
            moutains[i].x_pos + 400, moutains[i].y_pos);
    }
}

function drawTrees() {

    for (var i = 0; i < trees.length; i++) {
            fill(94, 60, 7);
            rect(trees[i].x_pos, trees[i].y_pos - 150, 30, 150)
            fill(4, 68, 42);
            triangle(
                trees[i].x_pos - 60, trees[i].y_pos - 60,
                trees[i].x_pos + 15, trees[i].y_pos - 200,
                trees[i].x_pos + 100, trees[i].y_pos - 60
            );
            triangle(
                trees[i].x_pos - 60, trees[i].y_pos - 120,
                trees[i].x_pos + 15, trees[i].y_pos - 280,
                trees[i].x_pos + 100, trees[i].y_pos - 120
            );
        }
}
function drawSun() {
    noStroke();
    fill(244, 149, 55);
    ellipse(sun.x_pos, sun.y_pos, sun.size - 10);
    fill(252, 239, 84);
    ellipse(sun.x_pos, sun.y_pos, sun.size - 35);
    fill(244, 149, 55);
    triangle(
            sun.x_pos - 15 , sun.y_pos  - 55,
            sun.x_pos , sun.y_pos - 90,
            sun.x_pos + 15 , sun.y_pos - 55
        );
    triangle(
            sun.x_pos - 15 , sun.y_pos  + 55,
            sun.x_pos , sun.y_pos + 90,
            sun.x_pos + 15 , sun.y_pos + 55
        );
    triangle(
            sun.x_pos - 55 , sun.y_pos - 15,
            sun.x_pos - 90 , sun.y_pos,
            sun.x_pos - 55 , sun.y_pos + 15
        );
    triangle(
            sun.x_pos + 55 , sun.y_pos - 15,
            sun.x_pos + 90 , sun.y_pos,
            sun.x_pos + 55 , sun.y_pos + 15
        );
}
function drawCollectable(t_collectable) {


    if (!t_collectable.isFound) {
        fill(255, 170, 0);
        ellipse(
            t_collectable.x_pos - 30,
            t_collectable.y_pos - 30,
            t_collectable.size,
            t_collectable.size
        );
        fill(137, 89, 3);
        ellipse(
            t_collectable.x_pos - 30,
            t_collectable.y_pos - 30,
            t_collectable.size - 15,
            t_collectable.size - 15
        );
        fill(255);
        rect(
            t_collectable.x_pos - 40,
            t_collectable.y_pos - 42,
            t_collectable.rect_width,
            t_collectable.rect_height
        );
        fill(255);
        rect(
            t_collectable.x_pos - 40,
            t_collectable.y_pos - 32,
            t_collectable.rect_width,
            t_collectable.rect_height
        );
        fill(255);
        rect(t_collectable.x_pos - 40,
            t_collectable.y_pos - 22,
            t_collectable.rect_width,
            t_collectable.rect_height
        )
        fill(255);
        rect(t_collectable.x_pos - 43,
            t_collectable.y_pos - 40,
            t_collectable.rect_height + 2,
            t_collectable.rect_height + 5
        )
        fill(255);
        rect(t_collectable.x_pos - 25,
            t_collectable.y_pos - 30,
            t_collectable.rect_height + 2,
            t_collectable.rect_height + 5
        )
        fill(255);
        rect(t_collectable.x_pos - 34,
            t_collectable.y_pos - 46,
            t_collectable.rect_height + 2,
            t_collectable.rect_height + 29
        )
    }

}

function drawCanyon(t_canyon) {

    fill(10, 124, 124);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, floorPos_y, 25)
    // fill(2, 56, 33);
    // rect(t_canyon.x_pos, floorPos_y + 30, t_canyon.width, floorPos_y)
    fill(20, 242, 30);
    rect(t_canyon.x_pos, floorPos_y + 125, t_canyon.width, floorPos_y)

}
function createPlatforms(x,y,width){
    //factory pattern
    var platform = {
                    x:x,
                    y:y,
                    width: width,
                    draw: function(){
                        fill(19, 142, 97);
                        rect(this.x, this.y -7,
                             this.width, 7, 
                             50,50,
                             0,0);
                        fill(147, 97, 24);
                        rect(this.x, this.y, 
                             this.width, 20,
                             0,0,
                             50,50);
                    },
                    checkContact: function(gameCharacterX, gameCharacterY) {
                        if (gameCharacterX > this.x -10 && gameCharacterX < (this.x + this.width + 10)) {
                            var distance = this.y - gameCharacterY;
                            if (distance >= -1 && distance < 2) {
                                return true;
                            }
                            return false;
                        }
                    }
    }
    return platform;
}
function enemySlime(xPos, yPos, size){
 
    this.distance = 100;
    this.step = random(0,3);
    this.x = xPos;
    this.y = yPos;
    this.currentX = xPos;
    this.size = size;
    this.drawSlime = function()
    {
        fill(97,193,35);
        triangle(this.x , this.y - 50, 
                 this.x - 30, this.y - 15, 
                 this.x + 30, this.y - 15);
        rect(this.x - 30 , this.y - 15, this.size, this.size - 45, 0, 0, 125, 125);
        fill(255);
        ellipse(this.x - 10, this.y - 20 , this.size - 45, this.size - 45);
        ellipse(this.x + 10, this.y - 20 , this.size - 45, this.size - 45)
        fill(0);
        ellipse(this.x - 10, this.y - 20 , this.size - 54, this.size - 54);
        ellipse(this.x + 10, this.y - 20 , this.size - 54, this.size - 54);
        fill(255);
        rect(this.x - 12, this.y - 9, this.size - 37, this.size - 56, 50)
    };
    this.move = function() {
    this.x += this.step;

    if (this.x >= this.currentX + this.distance) {
      this.step = -1;
    } else if (this.x < this.currentX) {
      this.step = 1;
    }
};
    this.checkContact = function(gameCharacterX, gameCharacterY)
    {
        if (dist(gameCharacterX, gameCharacterY,
            this.x, this.y) < this.size - 23) 
        {
            return true;
        }
    };
 
 
}

function checkCollectable(t_collectable) {

    if (dist(gameChar_x - scrollPos, gameChar_y,
            t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size) {
        t_collectable.isFound = true;
        game_score += 1;
        coinSound.play();
        fill(137, 89, 3);
          
    }

}
    
function checkCanyon(t_canyon) {
    if (
        gameChar_x - scrollPos > t_canyon.x_pos + 35 &&
        gameChar_x - scrollPos < t_canyon.x_pos + t_canyon.width - 35 
        &&
        gameChar_y >= floorPos_y
    ) {
        isPlummeting=true;
        jumpOffSound.play();
    }
 
}

function renderFlagpole() {
    push();
    strokeWeight(5);
 
    stroke(29, 29, 31);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    fill(255, 170, 0);
 
    if (flagpole.isReached && game_score == collectables.length) {
        rect(flagpole.x_pos, floorPos_y - 200, 100, 65);
        fill(255);
        noStroke();
        rect(flagpole.x_pos+ 33, floorPos_y -55 - 135,30,8);
        rect(flagpole.x_pos+ 33, floorPos_y -35 - 135,30,8);
        rect(flagpole.x_pos+ 33, floorPos_y -18 - 135,30,8);
        
        rect(flagpole.x_pos+ 28, floorPos_y -52 - 135,8,20);
        rect(flagpole.x_pos+ 60, floorPos_y -32 - 135,8,20);
        rect(flagpole.x_pos+ 43, floorPos_y -58 - 135,8,53);
        
    } else {
        rect(flagpole.x_pos, floorPos_y - 65, 100, 65);
        fill(255);
        noStroke();
        rect(flagpole.x_pos+ 33, floorPos_y -55,30,8);
        rect(flagpole.x_pos+ 33, floorPos_y -35,30,8);
        rect(flagpole.x_pos+ 33, floorPos_y -18,30,8);
        
        rect(flagpole.x_pos+ 28, floorPos_y -52,8,20);
        rect(flagpole.x_pos+ 60, floorPos_y -32,8,20);
        rect(flagpole.x_pos+ 43, floorPos_y -58,8,53);
    }
    
    noStroke();
    pop();
    
}

function checkFlagpole() {
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d < 15 && game_score == collectables.length) {
        flagpole.isReached = true;
        backgroundSound.stop();
        victorySound.play();
    }else  if(d < 15 && game_score < collectables.length){
      noStroke();
      fill(100,100,100,150);
      rect(80, 225, 880, 100, 25);
      textSize(36);
      textStyle(BOLD);
      textAlign(CENTER);
      fill(255);
      text("Oops! Not Enough Coins, Can't be Coins Hunter", width / 2, height / 2); 
    }
}

function checkPlayerDie() {
    if (gameChar_y > height && lives > 0) {
        lives -= 1;
        if (lives > 0) {
            restart();
        }
    }
}
function drawLifeTokens() {
    hpCount_x = 145;
    hpCount_y = 165;
    tokenSize = 35;
    var tokenPadding = 10; 
    var startX = 120; 
    var startY = 100; 
    var tokenColor = color(0, 0, 0); 

    for (var i = 0; i < lives; i++) {
        var tokenX = hpCount_x + (tokenSize + tokenPadding) * i;
        noStroke();
        
        fill(0);
        ellipse(tokenX, hpCount_y - 55, tokenSize);
        fill(255, 255, 255);
        ellipse(tokenX, hpCount_y - 55, tokenSize - 5);

        fill(29, 29, 31);
        noStroke();
        beginShape();
        curveVertex(tokenX - 15,  hpCount_y - 62);
        curveVertex(tokenX - 14,  hpCount_y - 65);
        curveVertex(tokenX, hpCount_y - 71);
        curveVertex(tokenX + 5, hpCount_y - 70);
        curveVertex(tokenX + 14, hpCount_y - 63);
        endShape(CLOSE);

        fill(255, 255, 255);
        noStroke();
        beginShape();
        curveVertex(tokenX + 10, hpCount_y - 60);
        curveVertex(tokenX - 2, hpCount_y - 60);
        curveVertex(tokenX + 2, hpCount_y - 68);
        curveVertex(tokenX + 2, hpCount_y - 69);
        curveVertex(tokenX + 5, hpCount_y - 64);
        endShape(CLOSE);

        fill(29, 29, 31);
        rect(tokenX - 14, hpCount_y - 59, tokenSize - 23, 2.6);

        fill(29, 29, 31);
        ellipse(tokenX - 8, hpCount_y - 55, tokenSize - 30);

        fill(29, 29, 31);
        rect(tokenX + 2, hpCount_y - 59, tokenSize - 23, 2.6);

        fill(29, 29, 31);
        ellipse(tokenX + 8, hpCount_y - 55, tokenSize - 30);

        fill(29, 29, 31);
        rect(tokenX - 1, hpCount_y - 55, 2.6, 8);

        fill(29, 29, 31);
        rect(tokenX + 1, hpCount_y - 45, 6, 2.6);

    }
}
//Generate Random Object, avoid object too close
function generateRandomObjects(count, createFn, overlapFn) {
    let objects = [];
    while (objects.length < count) {
        let newObj = createFn();
        if (!objects.some(obj => overlapFn(obj, newObj))) {
            objects.push(newObj);
        }
    }
    return objects;
}
function createRandomCollectable(){
    return {
        x_pos: round(random(600, 4000)),
        y_pos: floorPos_y,
        size: 60,
        isFound: false,
        rect_width: 18,
        rect_height: 4
    };
}

function startGame() {

    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    isLeft = false;
    isFalling = false;
    isRight = false;
    isPlummeting = false;
    minX = -50;
    maxX = 4700;
    //count timer for game 
    startTime = millis();
    elapsedTime = millis() - startTime;
    var minutes = Math.floor(elapsedTime / 60000);
    var seconds = Math.floor((elapsedTime % 60000) / 1000);
    
    backgroundSound.loop();

    clouds=[];
    for (var i=0; i<250; i++){
        clouds.push({x_pos:round(random(-15000,20000)),
                     y_pos:round(random(30,200))
                   });
    }
    moutains = [];
    for(var i=0; i<48; i++){
        moutains.push({x_pos:round(random(-500,4000)),
                     y_pos:floorPos_y});
    }
    collectables = generateRandomObjects(4, createRandomCollectable, function(a, b) {
        return a.x_pos === b.x_pos && a.size === b.size;
    });

    platforms=[];
    for (var i = 0; i < 10; i++) {
        var platformX = random(500, 4000);
        var platformY = random(floorPos_y - 45, 300);
        var platformWidth = random(80, 150);
        // Check for overlapping platforms
        var overlap = false;
        for (var j = 0; j < platforms.length; j++) {
            var otherPlatform = platforms[j];
            var minDistance = platformWidth + otherPlatform.width;
            if (abs(platformX - otherPlatform.x) < minDistance) {
                overlap = true;
                break;
            }
        }
        // If there is an overlap, skip this platform and try again
        if (overlap) {
            i--;
            continue;
        }
        platforms.push(createPlatforms(platformX, platformY, platformWidth));
        if(i<5)
        {
            collectables.push({
                x_pos: platforms[i].x + round(random(platforms[i].width,50)),
                y_pos: platforms[i].y - 10,
                size: 60,
                isFound: false,
                rect_width: 18,
                rect_height: 4
            })
        }
    }
    
    slimes = [];
    for (var i = 0; i < 10; i++) {
        var slimeX = random(1000, 4000);
        var slimeY = floorPos_y;
        var slimeSize = 60;

        // Check for overlapping slimes and platforms
        var overlap = false;
        for (var j = 0; j < slimes.length; j++) {
            var otherSlime = slimes[j];
            var minDistance = slimeSize + otherSlime.size;
            if (abs(slimeX - otherSlime.x) < minDistance) {
                overlap = true;
                break;
            }
            for (var k = 0; k < platforms.length; k++) {
                var platform = platforms[k];
                if (slimeX + slimeSize > platform.x && slimeX - slimeSize < platform.x + platform.width) {
                    overlap = true;
                    break;
                }
            }
        }
        // If there is an overlap, skip this slime and try again
        if (overlap) {
            i--;
            continue;
        }
        slimes.push(new enemySlime(slimeX, slimeY, slimeSize));
    }
    trees = 
        [
        {
            x_pos:300,
            y_pos: floorPos_y,
        },
        {
            x_pos:500,
            y_pos: floorPos_y,
        },
        {
            x_pos:700,
            y_pos: floorPos_y,
        },
        {
            x_pos:800,
            y_pos: floorPos_y,
        },
        {
            x_pos:900,
            y_pos: floorPos_y,
        },
        {
            x_pos:1300,
            y_pos: floorPos_y,
        },
        {
            x_pos:1500,
            y_pos: floorPos_y,
        },
        {
            x_pos:2400,
            y_pos: floorPos_y,
        },
        {
            x_pos:2700,
            y_pos: floorPos_y,
        },
        {
            x_pos:3060,
            y_pos: floorPos_y,
        },
        {
            x_pos:3200,
            y_pos: floorPos_y,
        },
        {
            x_pos:3600,
            y_pos: floorPos_y,
        },
        
    ]
    canyons = 
        [
        {
            x_pos: 0,
            width: random(100, 250)
        },
        {
            x_pos: 1000,
            width: random(100, 250)
        },
        {
            x_pos: 1700,
            width: random(100, 250)
        },
        {
            x_pos: 2000,
            width: random(100, 250)
        },
        {
            x_pos: 2500,
            width: random(100, 250)
        },
        {
            x_pos: 2800,
            width: random(100, 250)
        },
        {
            x_pos: 3800,
            width: random(100, 250)
        },
        {
            x_pos: 4200,
            width: random(100, 250)
        },
    ];
    sun = {
        x_pos: 820,
        y_pos: 110,
        size: 110
    };

    scrollPos = 0;
    flagpole = {
        isReached: false,
        x_pos: 4500,
    }
}

function restart(){
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
	scrollPos = 0;
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
}

 