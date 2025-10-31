/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mfuente- <mfuente-@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/28 16:07:34 by mfuente-          #+#    #+#             */
/*   Updated: 2025/10/30 18:16:29 by mfuente-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const bar1 = document.getElementById('bar1');
const bar2 = document.getElementById('bar2');
const ball = document.getElementById('ball');
const line = document.getElementById('line');
const line2 = document.getElementById('line2');
const point1= document.getElementById('point1');
const point2= document.getElementById('point2');

//Posible funcion para iniciar los siguientes parametros
let player1 = new Object();
let player2 = new Object();
player1.keyPress = false;
player1.keyCode = null;
/*****VARIABLES*****/
let y1 = bar1.offsetTop;
let y2 = bar2.offsetTop;
let contPoint1 = 0;
let contPoint2 = 0;
const mov = 10;
const speed = 15;
let angle;
let controlGame;
let width = document.documentElement.clientWidth - mov;
let height = line.offsetTop;
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

function randomBallAngle()
{
    angle = (Math.floor(Math.random() * 4) * (Math.PI / 2)) - (Math.PI / 4);
    angle -= (Math.random() * 2) * Math.PI / 8 - Math.PI / 8;
}

function bounceBallVertical()
{
    angle = -angle;
}

function bounceBallHorizontal()
{
    angle = Math.PI - angle;
}

function moveBar()
{
    if(player1.keyPress== true)
    {
        if(player1.keyCode == 'w')
        {
            if((y1 - mov) > height)
                y1 = y1 - mov;
            bar1.style.top = (y1) + "px";
        }
        if(player1.keyCode == 's')
        {
            if((y1 - mov) < ((line2.offsetTop - bar1.offsetHeight) - line2.offsetHeight - 10 ))
                y1 = y1 + mov;
            bar1.style.top = (y1) + "px";
        }
    }
    console.log("*****"+bar2.style.top);
    //console.log("------"+ball.style.top);
    if(player2.keyPress== true)
    {
        
        if(player2.keyCode == "ArrowUp")
        {
            if((y2 - mov) > height)
                y2 = y2 - mov;
            bar2.style.top = y2 + "px";
        }
        if(player2.keyCode == "ArrowDown")
        {
            if((y2 - mov) < ((line2.offsetTop - bar1.offsetHeight) - line2.offsetHeight - 10 ))
                y2 = y2 + mov;
            bar2.style.top = y2 + "px";
        }
    }
}
function hitBarLeft()
{
    //Que este en la misma distancia
    //Que este por encima del limite inferior de la barra
    //Que este por debajo del limite superior de la barra
	//Que este moviendose hacia la barra
    if(ball.offsetLeft <= (bar1.offsetLeft + bar1.offsetWidth) &&
    ball.offsetTop >= bar1.offsetTop + 5 &&
    ball.offsetTop <= (bar1.offsetTop + bar1.clientHeight) &&
	Math.cos(angle) < 0)
        return true;
    return false;
}

function hitBarRight()
{
    //Que este en la misma distancia
    //Que este por encima del limite inferior de la barra
    //Que este por debajo del limite superior de la barra
    if(ball.offsetLeft >= (bar2.offsetLeft - bar2.offsetWidth) &&
    ball.offsetTop >= bar2.offsetTop + 5 &&
    ball.offsetTop <= (bar2.offsetTop + bar2.clientHeight) &&
	Math.cos(angle) > 0)
        return true;
    return false;
}
//*****COSAS DEL BALL*****/
// Comprueba el estado de la bola
function checkStateBall(){
    //POR SI CHOCA CON UNA DE LAS BARRAS
    if(hitBarRight() || hitBarLeft())
        bounceBallHorizontal();

    //POR SI CHOCA CON EL TECHO O SUELO
    if(ball.offsetTop <= height || ball.offsetTop >=line2.offsetTop )
        bounceBallVertical();
    //Por si no choca
    if(ball.offsetLeft <= bar1.offsetLeft)//Le marcan al jugador de la Izquierda
    {
        ball.style.left = `${document.documentElement.clientWidth / 2}px`;
        ball.style.top = `${document.documentElement.clientHeight / 2}px`;
        randomBallAngle()
        contPoint2++;
        point2.textContent = contPoint2;
    }
    else
    {
        if(ball.offsetLeft >= bar2.offsetLeft)//Le marcan al jugador de la derecha
        {
            ball.style.left = `${document.documentElement.clientWidth / 2}px`;
            ball.style.top = `${document.documentElement.clientHeight / 2}px`;
            randomBallAngle()
            contPoint1++;
            point1.textContent = contPoint1;
        }
    }

}

function moveBall(){
    checkStateBall();
    ball.style.left = (ball.offsetLeft + Math.cos(angle) * speed) +"px";
    ball.style.top = (ball.offsetTop + Math.sin(angle) * speed) +"px";
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
    controlGame = setInterval(play, 50);
    randomBallAngle()
}
start();