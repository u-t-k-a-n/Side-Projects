import { getInputDirection } from './input.js';

export const SNAKE_SPEED = 5;
const snakeBody = [{ x: 11, y: 11 }];
let newSegments = 0;

export function update(){
    addSegments();
    const inputDirection = getInputDirection();
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i+1] = { ...snakeBody[i] };
    }
    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

export function draw(gameBoard){
    snakeBody.forEach(snakePart => {
        const snakePartElement = document.createElement('div');
        snakePartElement.style.gridColumnStart = snakePart.x;
        snakePartElement.style.gridRowStart = snakePart.y;
        snakePartElement.classList.add('snake');
        gameBoard.appendChild(snakePartElement);
    });
}

export function expandSnake(amount){
    newSegments += amount;
}

export function onSnake(position, { ignoreHead = false } = {}){
    return snakeBody.some((snakePart, index) => {
        if (ignoreHead && index === 0) return false;
        return equalPositions(snakePart, position);
    });
}

export function getSnakeHead(){
    return snakeBody[0];
}

export function snakeIntersection(){
    return onSnake(snakeBody[0], { ignoreHead: true })
}

function equalPositions(position1, position2){
    return position1.x === position2.x && position1.y === position2.y;
}

function addSegments(){
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
    newSegments = 0;
}

