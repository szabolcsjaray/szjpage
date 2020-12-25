var canvasEl;
var c2d;
var W,H, S;
var animationState = 0;

const speeds = {'slow':0.2,'fast':1,'stop':0};
var sysspeed = 1;
var actPlanet = null;
var namesOn = true;
var nameDivs = [];

var ps = [
    {
        'orbit' : 30,
        'name': 'SBV',
        'descr': 'A kit of tools for translating, adjusting, timing, and editing subtitles in SBV format.',
        'title': 'SBVHelper',
        'area' : 50,
        'size' : 20,
        'color' : '#B05050',
        'color2': '#201010',
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
        'color2': '#301040',
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
                'color2': '#103040',
                'name': 'Hexa',
                'descr': 'Triangle based (hexagonal) labyrinth drawer visual.<br>'+
                         'Can be parametrized for draw different ways, with different colors.',
                'title': 'Hexagonal space',
                'link': 'visual/hexa.html',
                'canvas' : null,
                'fi': 0
            },
            {
                'orbit': 70,
                'size' : 11,
                'area': 20,
                'color' : '#0020B0',
                'color2': '#000320',
                'name': 'GravPic',
                'link': 'visual/gravpic.html',
                'descr': 'Gravity simulator.<br>'+
                         'Calculates the move of masses, in their gravity field, with visualizing the gravity acceleration vectors as different colors.<br>'+
                         'Show the result as an animation.',
                'title': 'Gravity Pictures',
                'canvas' : null,
                'fi': 0
            },
            {
                'orbit': 90,
                'size' : 11,
                'area': 20,
                'color' : '#205030',
                'color2': '#001004',
                'name': 'EqualP',
                'link': 'visual/eqpoints/equal3d.html',
                'descr': 'Equal points.<br>'+
                         'Calculates a surface of points that has equal weighted distance summary from a set of points.<br>'+
                         'Show the result as an animation. The red dot falling through has negative weight. Te animation is rotated.',
                'title': 'Equal Points Surface',
                'canvas' : null,
                'fi': 1
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
    nameDivs = [];
    draw(el('div1'), c2d, ps, canvasEl);
}

function getRGB(col) {
    let R, G, B;
    if (col.charAt(0)=='#') {
        R = parseInt(col.substr( 1,2), 16);
        G = parseInt(col.substr(3,2), 16);
        B = parseInt(col.substr( 5,2), 16);
    } else {
        R = parseInt(col.substr( 0,3), 10);
        G = parseInt(col.substr( 3,3), 10);
        B = parseInt(col.substr( 6,3), 10);
    }
    return [R,G,B];
}

function colGrad(col, col2, grad) {
    let RGB1 = getRGB(col);
    let RGB2 = getRGB(col2);
    let RR = Math.floor(RGB1[0]*(1-grad)+RGB2[0]*grad);
    let GR = Math.floor(RGB1[1]*(1-grad)+RGB2[1]*grad);
    let BR = Math.floor(RGB1[2]*(1-grad)+RGB2[2]*grad);
    return "#"+("0"+RR.toString(16)).slice(-2)+("0"+GR.toString(16)).slice(-2)+("0"+BR.toString(16)).slice(-2);
}

function goTo(link) {
    window.open(link);
}

function drawBg(cont) {
    let fillStyles = ["#dfdfd0", "#ffdfd0", "#ffdff0"];
    for(let i =0;i<1000;i++) {
        let x = Math.random()*W;
        let y = Math.random()*H;
        cont.fillStyle = fillStyles[Math.floor(Math.random()*3)];
        cont.beginPath();

        let rs = Math.random()*2;
        if (Math.random()<0.02) {
            rs = 1+Math.random()*2;
        }
        cont.arc(x, y, rs, 0, Math.PI * 2, false);
        cont.fill();
    }

    for(let rad=20;rad>2;rad--) {
        cont.beginPath();
        cont.arc(W/2, H/2, rad, 0, Math.PI * 2, false);
        cont.strokeStyle="grey";
        cont.fillStyle=colGrad("236236086", "255255154",  rad/20);
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
            nameDivs.push(p.divName);
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

function names(id) {
    namesOn = !namesOn;
    let divClass;
    if (namesOn) {
        el(id).className = 'buttonDiv active';
        divClass = 'nameDiv';
    } else {
        el(id).className = 'buttonDiv';
        divClass = 'nameDiv hiddenDiv';
    }
    nameDivs.forEach(
        function(divEl) {
            divEl.className = divClass;
        }
    )
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