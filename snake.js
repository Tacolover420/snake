var config = {
    apiKey: "AIzaSyCp-YouZr_fkhRBn5eLheTAARH8CvVtVNY",
    authDomain: "gamingwebsite-b16e5.firebaseapp.com",
    databaseURL: "https://gamingwebsite-b16e5.firebaseio.com",
    projectId: "gamingwebsite-b16e5",
    storageBucket: "gamingwebsite-b16e5.appspot.com",
    messagingSenderId: "813467457055"
  };
  firebase.initializeApp(config);
  var firestore = firebase.firestore();

  let name, email, uid, emailVerified;
       firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
           name = user.displayName;
           email = user.email;
           emailVerified = user.emailVerified;
           uid = user.uid;
           
        } else {
          document.getElementById('test').innerText="error";
      }
      });
  // const docRef = firestore.doc("snake_game/1bewWwASDo7bg2Dkq44X");
  const table = document.querySelector("#score");

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const box = 32;

const ground = new Image();
ground.src = "img/ground.png";

const flooding = new Image();
flooding.src = "img/food.png";

const dead = new Audio();
const eat = new Audio();
const left = new Audio();
const right = new Audio();
const up = new Audio();
const down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
left.src = "audio/left.mp3";
up.src = "audio/up.mp3";
down.src = "audio/down.mp3";
right.src = "audio/right.mp3";

var snake = [];
snake[0] = {
	x : 9*box,
	y : 10 * box
}

let run = true;

let food = {
	x : Math.floor(Math.random()*17+1) * box,
	y : Math.floor(Math.random()*15+3) * box

}

let score = 0;

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

var rect = {
    x:7*box,
    y:9*box,
    width:32*5,
    height:32*2
};

var d;

document.addEventListener("keydown", direction);

function direction(event){
	if(event.keyCode == 37 && d != "RIGHT" ){
		d ="LEFT";
		left.play();
	}
	else if(event.keyCode == 38 && d != "DOWN" ){
		d ="UP";
		up.play();
	}
	else if(event.keyCode == 39 && d != "LEFT" ){
		d ="RIGHT";
		right.play();
	}
	else if(event.keyCode == 40 && d != "UP" ){
		d ="DOWN";
		down.play();
	}
}

function collision(head,array){
	for(let i=0;i<array.length;i++){
		if(head.x == array[i].x && head.y == array[i].y){
			return true;
		}
	}
	return false;
}

function draw(){
	ctx.drawImage(ground,0,0);

	ctx.drawImage(flooding, food.x, food.y);

	for(let i = 0; i < snake.length ; i++){
		ctx.fillStyle = (i==0)? "green" : "orange";
		ctx.fillRect(snake[i].x,snake[i].y,box,box);

		ctx.strokeStyle = "red";
		ctx.strokeRect(snake[i].x,snake[i].y,box,box);
	}
	

	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	if(snakeX == food.x && snakeY==food.y){
		score++;
		eat.play();
		food={
			x:Math.floor(Math.random()*17+1) *box,
			y:Math.floor(Math.random()*15+3) *box
		}
	} else{
		snake.pop();		
	}

	if( d=="LEFT") snakeX -= box;
	if( d=="UP") snakeY -= box;
	if( d=="RIGHT") snakeX += box;
	if( d=="DOWN") snakeY += box;

	

	let newHead = {
		x: snakeX,
		y: snakeY
	}
	if(snakeX<box|| snakeX>17*box||snakeY<3*box||snakeY>17*box||collision(newHead,snake)){
		dead.play();
		clearInterval(game);
		run = false;

		ctx.fillStyle = 'red';
	    ctx.fillRect(7*box, 9*box, 32*5, 32*2);
	    
	    ctx.fillStyle = "white";
	    ctx.font = "25px Change one";
		ctx.fillText("TRY AGAIN",7*32+12,10*box+10);
	}
	snake.unshift(newHead);



	ctx.fillStyle = "white";
	ctx.font = "45px Change one";
	ctx.fillText(score,2*box,1.6*box);

}

if("ontouchstart" in document.documentElement){

	document.addEventListener('touchstart', handleTouchStart, false);        
	document.addEventListener('touchmove', handleTouchMove, false);

	var xDown = null;                                                        
	var yDown = null;

	function getTouches(evt) {
	  return evt.touches ||             // browser API
	         evt.originalEvent.touches; // jQuery
	}                                                     

	function handleTouchStart(evt) {
	evt.preventDefault();   
	    const firstTouch = getTouches(evt)[0];                                      
	    xDown = firstTouch.clientX;                                      
	    yDown = firstTouch.clientY; 
	                                         
	};                                                

	function handleTouchMove(evt) {
	evt.preventDefault(); 
	    if ( ! xDown || ! yDown ) {
	        return;
	    }

	    var xUp = evt.touches[0].clientX;                                    
	    var yUp = evt.touches[0].clientY;

	    var xDiff = xDown - xUp;
	    var yDiff = yDown - yUp;

	    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
	        if ( xDiff > 0  && d != "RIGHT") {
	            d ="LEFT";
				left.play();
	        } else {
	        	if(d != "LEFT"){
	        		d ="RIGHT";
					right.play();
	        	}
	        }                       
	    } else {
	        if ( yDiff > 0  && d != "DOWN") {
	            d ="UP";
				up.play();
	        } else { 
	        	if(d != "UP"){
	        		d ="DOWN";
					down.play();
	        	}
	            
	        }                                                                 
	    }
	    /* reset values */
	    xDown = null;
	    yDown = null;   
	                                              
	};
};


var game;

cvs.addEventListener('click', reset, false);

function reset(event){
	var mousePos = getMousePos(cvs, event);
   	if (isInside(mousePos,rect) && !run) {
   		score = 0;
   		food = {
			x : Math.floor(Math.random()*17+1) * box,
			y : Math.floor(Math.random()*15+3) * box
		}
		snake = [];
		snake[0] = {
			x : 9*box,
			y : 10 * box
		}
		d=""
		if (!run){
			game = setInterval(draw,150);
			run = true;
		}
    	

    }
}

game = setInterval(draw,150);

let minscore=0;
let mymax = 0;

getRealtimeScoreBoard = function(){
  	firestore.collection("snake_game").orderBy("score", "desc")
    .onSnapshot(function(querySnapshot) {
        
        let count=0;
        querySnapshot.forEach(function(doc) {

            const myData = doc.data();
		    const myID = doc.id;

		    if(myID==uid && mymax<myData.score){
				mymax = myData.score;
			}

		    if(count==0){
		    	table.innerHTML = "";
		    }
		    
		    count+=1;
		    if(count<11){
		    	minscore=myData.score;
		  		var row = table.insertRow(table.rows.length);
			    var cell1 = row.insertCell(0);
			    var cell2 = row.insertCell(1);
			    cell1.innerHTML = myData.name;
			    cell2.innerHTML = myData.score; 
		    } 
		    else{
		    	firestore.collection("snake_game").doc(myID).delete();
		    }
        });  
    });
  }

getRealtimeScoreBoard();

function updateScore(){
	if (score>minscore && mymax<score){
    	var newscore = firestore.collection("snake_game");
		newscore.doc(uid).set({
	    name: name, score: score });
	}
}

let uscore = setInterval(updateScore,500);
