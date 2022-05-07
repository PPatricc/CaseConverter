const textTochange =document.querySelector("textarea");

//Buttons funcionality
document.getElementById("upper-case").addEventListener("click",() => textTochange.value=textTochange.value.toUpperCase());

document.getElementById("lower-case").addEventListener("click",() => textTochange.value=textTochange.value.toLowerCase());

document.getElementById("proper-case").addEventListener("click",() => {
    capLetters_after_sign(textTochange,' ');
});
document.getElementById("sentence-case").addEventListener("click",()=>{
    capLetters_after_sign(textTochange,'. ');
});
document.getElementById("save-text-file").addEventListener("click",()=>{
    download("text.txt",textTochange.value)
});


//Additional functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function capLetters_after_sign(string, sign){
    const words =string.value.toLowerCase().split(sign);
    const capitalizeWords = words.map(value=> capitalizeFirstLetter(value));
    textTochange.value = capitalizeWords.join(sign);
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//Background animation

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.heigth = window.innerHeight;

let Particles;

//Mouse positioning

const mouse = {
    x:null,
    y:null,
    radius:((canvas.heigth/100) * (canvas.width/100))
}

window.addEventListener('mousemove',
    function (event){
    mouse.x=event.x;
    mouse.y=event.y;
    }
);

window.addEventListener('mouseout',
    function () {
    mouse.x=null;
    mouse.y=null;
    });

//Creating Particles for background

class Particle{
    constructor(x,y,directionX,directionY,size,color) {
        this.x=x;
        this.y=y;
        this.directionX=directionX;
        this.directionY=directionY;
        this.size=size;
        this.color=color;
    }
    //drawing particles
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size/2,0,Math.PI*2,false);
        ctx.fillStyle='rgba(50,48,87,0.2)';
        ctx.fill();
    }

    Bounce(){
        if(this.x > canvas.width || this.x <0){
            this.directionX=-this.directionX;
        }
        if(this.y > canvas.width || this.y <0){
            this.directionY=-this.directionY;
        }

        //Bouncing with mouse and drawing the particles
        let xAxis=mouse.x-this.x;
        let yAxis=mouse.y-this.y;

        let dist=Math.sqrt(xAxis*xAxis + yAxis*yAxis);

        if(dist<mouse.radius + this.size){
            if(mouse.x <this.x && this.x < canvas.width -this.size *5){
                this.x+=5;
            }
            if(mouse.x >this.x && this.x > this.size *5){
                this.x-=5;
            }

            if(mouse.y <this.y && this.y < canvas.heigth -this.size *5){
                this.y+=5;
            }
            if(mouse.y >this.y && this.y > this.size *5){
                this.y-=5;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}
function init(){
    Particles=[];
    const HowManyParticles = (canvas.heigth * canvas.width) / 11000;
    for(let i =0; i<HowManyParticles;i++){
        const size= (Math.random()*3)+1;
        const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + (size *2));
        const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + (size *2));
        const dirX = (Math.random() * 5) - 2.5;
        const dirY = (Math.random() * 5) - 2.5;
        const color = 'rgba(50,48,87,0.2)';

        Particles.push(new Particle(x,y,dirX,dirY,size,color));
    }
}

//Animation

function animate(){

    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(let i =0;i< Particles.length;i++){
        Particles[i].Bounce();
    }
    connect();
}

function connect (){
    for(let i=0;i<Particles.length;i++){
        for(let j=i;j<Particles.length;j++){
            const distance = ((Particles[i].x - Particles[j].x) * (Particles[i].x - Particles[j].x) + (Particles[i].y - Particles[j].y) * (Particles[i].y - Particles[j].y));
            if(distance < (canvas.width/9) * (canvas.heigth/9)){
                ctx.strokeStyle='rgba(50,48,87,0.3)';
                ctx.lineWidth=0.5;
                ctx.beginPath();
                ctx.moveTo(Particles[i].x,Particles[i].y);
                ctx.lineTo(Particles[j].x,Particles[j].y);
                ctx.stroke();
            }
        }

    }
}


init();
animate();