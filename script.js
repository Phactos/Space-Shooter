const player = document.querySelector('.player');
const container = document.querySelector('#container');
const alienList = ['Assets/monster-1.png','Assets/monster-2.png','Assets/monster-3.png'];
let alienSpawn;
let startButton = document.querySelector('.start');


function keyHandler(event){
    if (event.key === 'ArrowUp' || event.key === 'w'){
        event.preventDefault();
        move('up');
    }
    else if (event.key === 'ArrowDown' || event.key === 's'){
        event.preventDefault();
        move('down');
    }
    else if (event.key === " "){
        event.preventDefault();
        shoot();
    }

    
}

function move(direction){
    let topPosition = parseInt(getComputedStyle(player).getPropertyValue('top'));
    if (topPosition > 0 && direction === 'up'){
        player.style.top = `${topPosition - 25}px` 
    }else if (topPosition < 550 && direction === 'down'){
        player.style.top = `${topPosition + 25}px` 
    }
    
}

function shoot(){
    let x = parseInt(getComputedStyle(player).getPropertyValue('left'));
    let y = parseInt(getComputedStyle(player).getPropertyValue('top'));
    let projectile = document.createElement('img');
    projectile.src = 'Assets/shoot.png';
    projectile.classList.add('laser');
    x = x + 10;
    projectile.style.left = `${x}px`;
    projectile.style.top = `${y - 10}px`;
    container.appendChild(projectile);

    
    
    laserMovement = setInterval(() => {
        let aliens = document.querySelectorAll('.alien');
        aliens.forEach((alien) => {
            if (checkColision(alien, projectile)){
                alien.src = "Assets/explosion.png";
                alien.classList.remove('alien');
                alien.classList.add('deadAlien')
            }
        })
        if (x > 340){
            projectile.remove();
            clearInterval(laserMovement)
        } else {
            x += 8;
            projectile.style.left = `${x}px`;
        }
    },10);
}

function createAliens(){
    let newAlien = document.createElement('img');
    newAlien.src = alienList[Math.floor(Math.random() * alienList.length)];
    newAlien.classList.add('alien');
    newAlien.classList.add('transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random()*330)+30}px`
    container.appendChild(newAlien);

    let moveAlien = setInterval(() => {
        let x = parseInt(newAlien.style.left);
        if (x <= 50){
            if (Array.from(newAlien.classList).includes('deadAlien')){
                newAlien.remove();
            }
            else {
                clearInterval(moveAlien);
                document.querySelectorAll('.alien').forEach((alien) => alien.remove());
                gameOver();
            }
        }
        else {
            newAlien.style.left = `${x - 4}px`
        }
    }, 30);
}

function checkColision(alien, projectile){
    let projectileTop = parseInt(projectile.style.top);
    let projectileLeft = parseInt(projectile.style.left);
    let projectileBotton = projectileTop - 20;

    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBotton = alienTop - 60;

    if (projectileLeft != 340 && projectileLeft + 40 >= alienLeft){
        if (projectileTop <= alienTop && projectileBotton >= alienBotton){
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}


function start(){
    startButton.style.display = 'none';
    document.addEventListener('keydown',keyHandler);
    alienSpawn = setInterval(createAliens,3000);
}

function gameOver(){
    document.removeEventListener('keydown',keyHandler);
    clearInterval(alienSpawn);
    document.querySelectorAll('.alien').forEach((alien) => alien.remove());
    document.querySelectorAll('.laser').forEach((laser) => laser.remove());
    startButton.style.display = 'block';
    alert('GameOver');
    
}