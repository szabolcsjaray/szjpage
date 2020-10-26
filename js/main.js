var canvasEl;
var c2d;
var W,H, S;

var ps = [
    {
        'orbit' : 30,
        'name': 'SBV Helper',
        'area' : 5,
        'size' : 8,
        'color' : 'red',
        'link': 'sbv/sbvadjust.html',
        'canvas' : null
    },
    {
        'orbit': 80,
        'area' : 10,
        'size' : 10,
        'color' : 'blue',
        'name': 'Visuals',
        'link': null,
        'canvas' : null,
        'ps' : [
            {
                'orbit': 80,
                'size' : 5,
                'area': 5,
                'color' : 'lightblue',
                'name': 'Hexa',
                'link': 'hexa.html',
                'canvas' : null
            }
        ]
    }
];

function resizeCanvas() {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    W = canvasEl.width;
    H = canvasEl.height;
    if(W>H) {
        S = H;
    } else {
        S = W;
    }
    draw(canvasEl, c2d);
}

function draw(cEl, cont) {

    cont.beginPath();
    cont.arc(W/2, H/2, 10, 0, Math.PI * 2, false);
    cont.strokeStyle="grey";
    cont.fillStyle="#00ffff";
    cont.lineWidth = 1;
    cont.fill();
    cont.setLineDash([2, 3]);
    cont.strokeStyle="#404040";
    ps.forEach(p => {
        cont.beginPath();
        cont.arc(W/2, H/2, S/2*p.orbit/100, 0, Math.PI * 2, false);
        cont.stroke();
        if (p.canvas==null) {
            p.canvas = document.createElement("CANVAS");
            cEl.appendChild(p.canvas);
        }
        p.canvas.style.position='absolute';
        p.canvas.style.top = ""+(H/2-(p.orbit*S/200))+"px";
        p.canvas.style.left = ""+(W/2-5)+"px";
        p.canvas.style.width = ""+S/2*p.area+"px";
        p.c2d = p.canvas.getContext("2d");
        p.c2d.beginPath();
        p.c2d.arc(5,5,p.size,0,2*Math.PI, false);
        p.c2d.fillStyle = p.color;
        p.c2d.fill();
    });
}

function el(id) {
    return document.getElementById(id);
}

function start() {
    canvasEl = document.getElementById('cv1'),
    c2d = canvasEl.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    resizeCanvas();
}