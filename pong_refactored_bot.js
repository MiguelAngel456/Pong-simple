/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong_refactored_bot.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mfuente- <mfuente-@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/28 16:07:34 by mfuente-          #+#    #+#             */
/*   Updated: 2025/11/12 15:08:43 by mfuente-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const bar_left = document.getElementById('bar1');
const bar_right = document.getElementById('bar2');
const ball = document.getElementById('ball');
const line_ceiling = document.getElementById('line');
const line_floor = document.getElementById('line2');
const point1 = document.getElementById('point1');
const point2 = document.getElementById('point2');

//Player input state tracking
let player1 = {
	upPressed: false,
	downPressed: false
};
let player2 = {
	upPressed: false,
	downPressed: false
};
/*****VARIABLES*****/
// Paddle Settings
const paddle_height = 75;
const paddle_speed = 15;

// Ball settings
const ball_size = 25;
const starting_ball_speed = 15;
const ball_speed_increment = 0.1; // float (1 = 100%)
const angle_deviance = 30; //in degrees

// Game running DONT TOUCH
let paddle_left_position = bar_left.offsetTop;
let paddle_right_position = bar_right.offsetTop;
let ball_speed;
let angle;
let controlGame;
var player1Input = 0;
var player2Input = 0;
let contPoint1 = 0;
let contPoint2 = 0;

/******************/

document.addEventListener("keydown", function (event) {
	switch (event.key) {
		case "w":
			player1.upPressed = true;
			break;
		case "s":
			player1.downPressed = true;
			break;
		case "ArrowUp":
			player2.upPressed = true;
			break;
		case "ArrowDown":
			player2.downPressed = true;
			break;
	}
});

document.addEventListener("keyup", function (event) {
	switch (event.key) {
		case "w":
			player1.upPressed = false;
			break;
		case "s":
			player1.downPressed = false;
			break;
		case "ArrowUp":
			player2.upPressed = false;
			break;
		case "ArrowDown":
			player2.downPressed = false;
			break;
	}
});

// Sets the ball angle onto a random direction with some limitations
function randomBallAngle() {
	let rads = angle_deviance * Math.PI / 180;

	// Set the ball to one of the four main directions. (topleft, bottomright, etc)
	angle = (Math.floor(Math.random() * 4) * (Math.PI / 2)) - (Math.PI / 4);
	// Give the ball a small amount of deviation for unpredictability
	angle -= Math.random() * rads - rads / 2;
}


// Balls bounces off a Vertical surface (player paddle)
function bounceBallVertical(paddleLeft) {
	// Base reflection
	angle = Math.PI - angle;

	const maxDeflection = Math.PI / 6;
	var deflection;
	if (paddleLeft == true) {
		deflection = -(player1Input * maxDeflection);
	}
	else {
		deflection = (player2Input * maxDeflection);
	}
	angle += deflection;

	// Increase velocity
	ball_speed += starting_ball_speed * ball_speed_increment;
}

// Balls bounces off a Horizontal surface (floor/ceiling)
function bounceBallHorizontal() {
	angle = -angle;
}

function takePlayerInput() {
	// Calculate input direction based on pressed keys
	// If both up and down are pressed, they cancel out (= 0)
	player1Input = (player1.upPressed ? 1 : 0) - (player1.downPressed ? 1 : 0);
	player2Input = (player2.upPressed ? 1 : 0) - (player2.downPressed ? 1 : 0);
}

function moveBar(Player1Input, Player2Input) {
	if (Player1Input == 1) {
		if ((paddle_left_position - paddle_speed) > line_ceiling.offsetTop)
			paddle_left_position = paddle_left_position - paddle_speed;
		else
			paddle_left_position = line_ceiling.offsetTop;
		bar_left.style.top = (paddle_left_position) + "px";
	}
	if (Player1Input == -1) {
		if ((paddle_left_position + paddle_speed) < (line_floor.offsetTop - bar_left.offsetHeight))
			paddle_left_position = paddle_left_position + paddle_speed;
		else
			paddle_left_position = line_floor.offsetTop - bar_left.offsetHeight;
		bar_left.style.top = (paddle_left_position) + "px";
	}
	if (bar_right.offsetTop > ball.offsetTop)
    {	
        if((paddle_right_position - paddle_speed) > line_ceiling.offsetTop)
            paddle_right_position = paddle_right_position - paddle_speed;
		else
			paddle_right_position = line_ceiling.offsetTop;
        bar_right.style.top = paddle_right_position + "px"; 
    }
    if (bar_right.offsetTop < ball.offsetTop)
    {
        if((paddle_right_position + paddle_speed) < ((line_floor.offsetTop - bar_right.offsetHeight)))
            paddle_right_position = paddle_right_position + paddle_speed;
		else
			paddle_right_position = line_ceiling.offsetTop;
        bar_right.style.top = paddle_right_position + "px"; 
    }

}

// Checks if ball hits left Paddle
function hitBarLeft() {
	//Que este en la misma distancia
	//Que este por encima del limite inferior de la barra
	//Que este por debajo del limite superior de la barra
	//Que este moviendose hacia la barra
	if (ball.offsetLeft <= (bar_left.offsetLeft + bar_left.offsetWidth) &&
		ball.offsetTop + ball.clientHeight >= bar_left.offsetTop + 5 &&
		ball.offsetTop <= (bar_left.offsetTop + bar_left.clientHeight) &&
		Math.cos(angle) < 0)
		return true;
	return false;
}

// Checks if ball hits right Paddle
function hitBarRight() {
	//Que este en la misma distancia
	//Que este por encima del limite inferior de la barra
	//Que este por debajo del limite superior de la barra
	//Que este moviendose hacia la barra
	if (ball.offsetLeft + ball.clientWidth >= (bar_right.offsetLeft) &&
		ball.offsetTop + ball.clientHeight >= bar_right.offsetTop + 5 &&
		ball.offsetTop <= (bar_right.offsetTop + bar_right.clientHeight) &&
		Math.cos(angle) > 0)
		return true;
	return false;
}

//*****COSAS DEL BALL*****/
// Check ball events
function checkStateBall() {
	// Check paddle collision
	let hitBar = false;
	if (hitBarRight()) {
		bounceBallVertical(false);
		hitBar = true;
	}
	if (hitBarLeft()) {
		bounceBallVertical(true);
		hitBar = true;
	}

	// Check floor/ceiling collision
	if ((ball.offsetTop <= line_ceiling.offsetTop && Math.sin(angle) < 0) || (ball.offsetTop + ball.clientWidth >= line_floor.offsetTop && Math.sin(angle) > 0))
		bounceBallHorizontal();

	// Check scoring
	if (hasScoredLeft())//Le marcan al jugador de la Izquierda
		scoreLeftPlayer();
	else if (hasScoredRight())//Le marcan al jugador de la derecha
		scoreRightPlayer();
}

// Left player score check
function hasScoredLeft() {
	return (ball.offsetLeft <= bar_left.offsetLeft);
}

// Right player score check
function hasScoredRight() {
	return (ball.offsetLeft >= bar_right.offsetLeft + bar_right.clientWidth);
}

// Left player score event
function scoreLeftPlayer() {
	contPoint2++;
	point2.textContent = contPoint2;
	resetRound();
}

// Right player score event
function scoreRightPlayer() {
	contPoint1++;
	point1.textContent = contPoint1;
	resetRound();
}

// Resets ball for new round
function resetRound() {
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
function moveBall() {
	// Take current position
	var positionX = ball.offsetLeft;
	var positionY = ball.offsetTop;

	// Split distance in Steps
	const steps = Math.max(1, Math.ceil(Math.abs(ball_speed)));

	// Move step by step
	for (let i = 0; i < steps; i++) {
		// Move ball a single step
		positionX += Math.cos(angle);
		positionY += Math.sin(angle);
		ball.style.left = positionX + "px";
		ball.style.top = positionY + "px";

		// If ball cillided, stop moving in current direction
		const prevAngle = angle;
		checkStateBall();
		if (angle !== prevAngle)
			break;
	}
}

/*************************/
function play() {
	moveBall();
	takePlayerInput();
	moveBar(player1Input, player2Input)
}
function stop() {
	clearInterval(controlGame);
}

function start() {
	ball.style.width = ball_size + "px";
	ball.style.height = ball_size + "px";
	ball.style.borderRadius = ball_size + "px";
	bar1.style.height = paddle_height + "px";
	bar2.style.height = paddle_height + "px";
	controlGame = setInterval(play, 50);
	resetRound()
}
start();