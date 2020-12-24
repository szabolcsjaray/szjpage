var canvasEl;
var c2d;
var W,H, S;
var animationState = 0;

const speeds = {'slow':0.2,'fast':1,'stop':0};
var sysspeed = 1;
var actPlanet = null;

var ps = [
    {
        'orbit' : 30,
        'name': 'SBV',
        'descr': 'A kit of tools for translating, adjusting, timing, and editing subtitles in SBV format.',
        'title': 'SBVHelper',
        'area' : 50,
        'size' : 10,
        'color' : '#0000F0',
        'color2': '#B05050',
        'link': 'sbv/sbvadjust.html',
        'canvas' : null,
        'fi': 0,
        ps: null
    },
    {
        'orbit': 80,
        'area' : 30,
        'size' : 15,
        'color' : '#AF20A0',
        'color2': '#303070',
        'name': 'Visuals',
        'descr': 'Collection of different visual webpages, javascript programs.',
        'title': 'Visuals',
        'link': null,
        'canvas' : null,
        'fi': 0,
        'ps' : [
            {
                'orbit': 40,
                'size' : 12,
                'area': 20,
                'color' : '#209090',
                'color2': '#B05050',
                'name': 'Hexa',
                'descr': 'Triangle based (hexagonal) labyrinth drawer visual.<br>'+
                         'Can be parametrized for draw different ways, with different colors.',
                'title': 'Visuals',
                'link': 'visual/hexa.html',
                'canvas' : null,
                'fi': 0
            },
            {
                'orbit': 80,
                'size' : 11,
                'area': 20,
                'color' : '#001090',
                'color2': '#0030B0',
                'name': 'GravPic',
                'link': 'visual/gravpic.html',
                'descr': 'Gravity simulator.<br>'+
                         'Calculates the move of masses, in their gravity field, with visualizing the gravity acceleration vectors.<br>'+
                         'Show the result as an animation.',
                'title': 'Gravity Pictures',
                'canvas' : null,
                'fi': 0
            }

        ]
    }
];

function findPlanetInPs(planet, ps) {
    for(let i=0;i<ps.length;i++) {
        if (ps[i].name==planet) {
            return ps[i];
        }
        if (ps[i].ps!=undefined && ps[i].ps!=null) {
            let findIn = findPlanetInPs(planet, ps[i].ps);
            if (findIn!=null) {
                return findIn;
            }
        }
    }
    return null;
}

function findPlanet(planet) {
    return findPlanetInPs(planet, ps);
}

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
    drawBg(c2d);
    draw(el('div1'), c2d, ps, canvasEl);
}

function colGrad(col, col2, grad) {
    let R = parseInt(col.substr( 1,2), 16);
    let G = parseInt(col.substr(3,2), 16);
    let B = parseInt(col.substr( 5,2), 16);
    let R2 = parseInt(col2.substr( 1,2), 16);
    let G2 = parseInt(col2.substr( 3,2), 16);
    let B2 = parseInt(col2.substr( 5,2), 16);
    let RR = Math.floor(R*(1-grad)+R2*grad);
    let GR = Math.floor(G*(1-grad)+G2*grad);
    let BR = Math.floor(B*(1-grad)+B2*grad);
    return "#"+("0"+RR.toString(16)).slice(-2)+("0"+GR.toString(16)).slice(-2)+("0"+BR.toString(16)).slice(-2);
}

function goTo(link) {
    window.open(link);
}

function drawBg(cont) {
    cont.fillStyle = "#cfcfc0";
    for(let i =0;i<1000;i++) {
        let x = Math.random()*W;
        let y = Math.random()*H;
        cont.beginPath();
        let rs = Math.random()*2;
        cont.arc(x, y, rs, 0, Math.PI * 2, false);
        cont.fill();
    }

    for(let rad=15;rad>2;rad--) {
        cont.beginPath();
        cont.arc(W/2, H/2, rad, 0, Math.PI * 2, false);
        cont.strokeStyle="grey";
        cont.fillStyle=colGrad("#ffe035", "#d0ff35",  rad/15);
        cont.lineWidth = 1;
        cont.fill();
    }
}

var stopped = false;

function stopAt(planet) {
    planet = findPlanet(planet);
    if (planet==null) {
        alert('problem, not found: '+planet);
        return;
    }
    actPlanet = planet;
    el('title').innerHTML = planet.title;
    el('pagetext').innerHTML = planet.descr;
    el('descr').style.display = 'block';
    if (planet.link!=null) {
        el('goto').style.display = 'inline-block';
    } else {
        el('goto').style.display = 'none';
    }
    stopped = true;
}

function startAgain(planet) {
    stopped = false;
}

function draw(divEl, cont, psPar, canvasEl) {

    let w = canvasEl.width;
    let h = canvasEl.height;
    let s;
    if(w>h) {
        s = h;
    } else {
        s = w;
    }

    cont.setLineDash([2, 3]);
    cont.strokeStyle="#404040";
    let divC = 0;
    psPar.forEach(p => {
        cont.beginPath();
        cont.arc(w/2, h/2, s/2*p.orbit/100, 0, Math.PI * 2, false);
        cont.moveTo(9, h/2);
        cont.lineTo(w, h/2);
        cont.moveTo(w/2, 0);
        cont.lineTo(w/2, h);
        cont.rect(0,0, w,h);
        cont.stroke();
        if (p.canvas==null) {
            p.div = document.createElement("DIV");
            divEl.appendChild(p.div);
            p.div.style.cursor = 'pointer';
            if (p.link!=null) {
                p.div.onclick = function() { goTo(p.link); };
            }
            p.canvas = document.createElement("CANVAS");
            p.div.appendChild(p.canvas);
            p.divName = document.createElement("DIV");
            p.divName.classList.add("nameDiv");
            p.div.appendChild(p.divName);
            p.divName.innerHTML = p.name;
            p.div.style.color = "white";
            p.divSense = document.createElement("DIV");
            p.divSense.classList.add("nameDiv");
            p.divSense.findName = p.name;
            //p.divSense.style.backgroundColor = 'blue';
            p.div.appendChild(p.divSense);
        }
        p.div.style.position='absolute';
        let areaS = s/100*p.area;
        p.S = s;
        p.H = h;
        p.W = w;
        //p.fi = 0;
        p.areaS = areaS;
        p.div.id = divEl.id +"_"+divC;
        divC++;
        p.div.style.top = ""+(p.H/2 + p.S*p.orbit/200*Math.sin(p.fi)-p.areaS/2)+"px";
        p.div.style.left = ""+(p.W/2 + p.S*p.orbit/200*Math.cos(p.fi)-p.areaS/2)+"px";
        p.divName.style.top = ""+(areaS/2-p.size-10)+"px";
        p.divName.style.left = ""+(areaS/2+p.size)+"px";
        p.divSense.style.top = ""+(areaS/2-p.size)+"px";
        p.divSense.style.left = ""+(areaS/2-p.size)+"px";
        p.divSense.style.width = (p.size*2)+"px";
        p.divSense.style.height = (p.size*2)+"px";

        p.divSense.onmouseover = function () {stopAt(p.divSense.findName);};
        p.divSense.onmouseout = function () {startAgain(p.divSense.findName);};

        p.canvas.style.width = ""+(areaS)+"px";
        p.canvas.setAttribute('width', ""+(areaS)+"px");
        p.canvas.style.height = ""+(areaS)+"px";
        p.canvas.setAttribute('height', ""+(areaS)+"px");
        p.c2d = p.canvas.getContext("2d");
        for(let rad=p.size;rad>2;rad--) {
            p.c2d.beginPath();
            p.c2d.arc(areaS/2,areaS/2,rad,0,2*Math.PI, false);
            p.c2d.fillStyle = colGrad(p.color, p.color2, rad/p.size);
            p.c2d.fill();
        }
        if (p.ps!=null) {
            draw(p.div, p.c2d, p.ps, p.canvas);
        }
    });
    if (animationState==0) {
        animationState = 1;
        orbitalMove();
    }
}

function animateThese(points, speed) {

    points.forEach(p => {
        p.fi = p.fi + Math.PI/400*speed*100/p.orbit*sysspeed;
        if (p.fi>2*Math.PI) {
            p.fi -= 2*Math.PI;
        }
        p.div.style.left = ""+(p.W/2 + p.S*p.orbit/200*Math.cos(p.fi)-p.areaS/2)+"px";
        p.div.style.top = ""+(p.H/2 + p.S*p.orbit/200*Math.sin(p.fi)-p.areaS/2)+"px";
        //p.div.style.transform = 'rotate('+(-p.fi*10)+'deg)';
        if (p.ps!=null) {
            animateThese(p.ps, speed*5);
        }
        //recursive comes here
    });
}

function orbitalMove() {
    if (!stopped) {
        animateThese(ps, 1);
    }
    setTimeout(orbitalMove, 50);

}

function el(id) {
    return document.getElementById(id);
}

function speed(id) {
    sysspeed = speeds[id];
    el(lastButton).className = 'buttonDiv';
    el(id).className = 'buttonDiv active';
    lastButton = id;
}

function start() {
    sysspeed = 1;
    lastButton = 'fast';
    canvasEl = document.getElementById('cv1'),
    c2d = canvasEl.getContext('2d');

    console.log(colGrad("#000000", "#A0FF0F", 0.5));
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    resizeCanvas();
}

function closeDesc() {
    el('descr').style.display = 'none';
}

function gotoLink() {
    if (actPlanet==null)
        return;
    goTo(actPlanet.link);
}