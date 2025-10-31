/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong_refactored.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mfuente- <mfuente-@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/28 16:07:34 by mfuente-          #+#    #+#             */
/*   Updated: 2025/10/31 15:56:55 by mfuente-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const bar_left = document.getElementById('bar1');
const bar_right = document.getElementById('bar2');
const ball = document.getElementById('ball');
const line_ceiling = document.getElementById('line');
const line_floor = document.getElementById('line2');
const point1= document.getElementById('point1');
const point2= document.getElementById('point2');

//Posible funcion para iniciar los siguientes parametros
let player1 = new Object();
let player2 = new Object();
player1.keyPress = false;
player1.keyCode = null;
/*****VARIABLES*****/
// Paddle Settings
let paddle_height = 150;
let paddle_speed = 10;
let paddle_left_position = bar_left.offsetTop;
let paddle_right_position = bar_right.offsetTop;

// Ball settings
let ball_speed;
let starting_ball_speed = 15;
let	ball_speed_increment = starting_ball_speed / 10;
let angle;
let	angle_deviance = 30; //in degrees

let controlGame;
let contPoint1 = 0;
let contPoint2 = 0;
/******************/

document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "w":
        case "s":
            player1.keyPress = true;
            player1.keyCode = event.key;
            break;
        case "ArrowUp":
        case "ArrowDown":
            player2.keyPress = true;
            player2.keyCode = event.key;
            break;  
    }
});

document.addEventListener("keyup", function(event) {
    if(event.key == "w" || event.key == "s") {
        player1.keyPress = false;
        player1.keyCode = null;
    }
    if(event.key == "ArrowUp" || event.key == "ArrowDown") {
        player2.keyPress = false;
        player2.keyCode = null;
    }
});

// Sets the ball angle onto a random direction with some limitations
function randomBallAngle()
{
	let rads = angle_deviance * Math.PI / 180;

	// Set the ball to one of the four main directions. (topleft, bottomright, etc)
    angle = (Math.floor(Math.random() * 4) * (Math.PI / 2)) - (Math.PI / 4);
	// Give the ball a small amount of deviation for unpredictability
    angle -= Math.random() * rads - rads / 2;
}


// Balls bounces off a Vertical surface (player paddle)
function bounceBallVertical()
{
	// Change angle
    angle = Math.PI - angle;
	// Increase velocity
	ball_speed += ball_speed_increment;
}

// Balls bounces off a Horizontal surface (floor/ceiling)
function bounceBallHorizontal()
{
    angle = -angle;
}

function moveBar()
{
    if(player1.keyPress == true)
    {
        if(player1.keyCode == 'w')
        {
            if((paddle_left_position - paddle_speed) > line_ceiling.offsetTop)
                paddle_left_position = paddle_left_position - paddle_speed;
			else
				paddle_left_position = line_ceiling.offsetTop;
            bar_left.style.top = (paddle_left_position) + "px";
        }
        if(player1.keyCode == 's')
        {
            if((paddle_left_position + paddle_speed) < (line_floor.offsetTop - bar_left.offsetHeight))
                paddle_left_position = paddle_left_position + paddle_speed;
			else
				paddle_left_position = line_floor.offsetTop - bar_left.offsetHeight;
            bar_left.style.top = (paddle_left_position) + "px";
        }
    }
    if(player2.keyPress == true)
    {
        
        if(player2.keyCode == "ArrowUp")
        {
            if((paddle_right_position - paddle_speed) > line_ceiling.offsetTop)
                paddle_right_position = paddle_right_position - paddle_speed;
			else
				paddle_right_position = line_ceiling.offsetTop;
            bar_right.style.top = paddle_right_position + "px";
        }
        if(player2.keyCode == "ArrowDown")
        {
            if((paddle_right_position + paddle_speed) < (line_floor.offsetTop - bar_right.offsetHeight))
                paddle_right_position = paddle_right_position + paddle_speed;
			else
				paddle_right_position = line_floor.offsetTop - bar_right.offsetHeight;
            bar_right.style.top = paddle_right_position + "px";
        }
    }
}

// Checks if ball hits left Paddle
function hitBarLeft()
{
    //Que este en la misma distancia
    //Que este por encima del limite inferior de la barra
    //Que este por debajo del limite superior de la barra
	//Que este moviendose hacia la barra
    if(ball.offsetLeft <= (bar_left.offsetLeft + bar_left.offsetWidth) &&
    (ball.offsetTop + ball.offsetWidth) >= bar_left.offsetTop + 5 &&
    ball.offsetTop <= (bar_left.offsetTop + bar_left.clientHeight) &&
	Math.cos(angle) < 0)
        return true;
    return false;
}

// Checks if ball hits right Paddle
function hitBarRight()
{
    //Que este en la misma distancia
    //Que este por encima del limite inferior de la barra
    //Que este por debajo del limite superior de la barra
	//Que este moviendose hacia la barra
    if(ball.offsetLeft >= (bar_right.offsetLeft - bar_right.offsetWidth) &&
    (ball.offsetTop + ball.offsetWidth) >= bar_right.offsetTop + 5 &&
    ball.offsetTop <= (bar_right.offsetTop + bar_right.clientHeight) &&
	Math.cos(angle) > 0)
        return true;
    return false;
}

//*****COSAS DEL BALL*****/
// Check ball events
function checkStateBall(){
    // Check paddle collision
    if(hitBarRight() || hitBarLeft())
        bounceBallVertical();

    // Check floor/ceiling collision
    if(ball.offsetTop <= line_ceiling.offsetTop || ball.offsetTop + ball.offsetHeight >=line_floor.offsetTop )
        bounceBallHorizontal();

    // Check scoring
    if (hasScoredLeft())//Le marcan al jugador de la Izquierda
   		scoreLeftPlayer();
    else if (hasScoredRight())//Le marcan al jugador de la derecha
        scoreRightPlayer();
}

// Left player score check
function hasScoredLeft()
{
	return (ball.offsetLeft <= bar_left.offsetLeft);
}

// Right player score check
function hasScoredRight()
{
	return (ball.offsetLeft >= bar_right.offsetLeft + bar_right.clientWidth);
}

// Left player score event
function scoreLeftPlayer()
{
	contPoint2++;
	point2.textContent = contPoint2;
	resetRound();
}

// Right player score event
function scoreRightPlayer()
{
	contPoint1++;
	point1.textContent = contPoint1;
	resetRound();
}

// Resets ball for new round
function resetRound()
{
	paddle_left_position = (line_floor.offsetTop - line_ceiling.offsetTop) / 2 + line_ceiling.offsetTop - bar_left.offsetHeight / 2;
	bar_left.style.top = (paddle_left_position) + "px";
	paddle_right_position = (line_floor.offsetTop - line_ceiling.offsetTop) / 2 + line_ceiling.offsetTop - bar_right.offsetHeight / 2;
	bar_right.style.top = (paddle_right_position) + "px";
	ball.style.left = `${document.documentElement.clientWidth / 2}px`;
	ball.style.top = (line_floor.offsetTop - line_ceiling.offsetTop) / 2 + line_ceiling.offsetTop - ball.offsetHeight / 2 + "px";;
	randomBallAngle()
	ball_speed = starting_ball_speed;
}

// Moves ball Forward
function moveBall(){
    checkStateBall();
    ball.style.left = (ball.offsetLeft + Math.cos(angle) * ball_speed) +"px";
    ball.style.top = (ball.offsetTop + Math.sin(angle) * ball_speed) +"px";
}

/*************************/
function play()
{
    moveBall();
    moveBar();
}
function stop(){
    clearInterval(controlGame);
}

function start()
{
	bar1.style.height = paddle_height + "px";
	bar2.style.height = paddle_height + "px";
    controlGame = setInterval(play, 50);
    resetRound()
}
start();