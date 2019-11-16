const svgArea = document.getElementById("svgArea");
const polyhedronMenu = document.getElementById("polyhedronMenu");

const viewPortWidth = 400;
const viewPortHeight = 400;
const viewBoxWidth = 40;

// create the svg element
const svgEl = document.createElementNS("http://www.w3.org/2000/svg","svg");
svgEl.setAttribute("width",viewPortWidth);
svgEl.setAttribute("height",viewPortHeight);
svgEl.setAttribute("viewBox",`-20 -20 ${viewBoxWidth} ${viewBoxWidth}`);

// insert svg element to page
svgArea.appendChild(svgEl);

// rotationKeyIncrement is the degree for each key press
const rotationKeyIncrement = 5;

// rotationMouseIncrement is the degree for mouse dragging
const rotationMouseIncrement = 5;

// a nested array of 3d coordinates.
let vertices;

// array, each element represent a face of polyhedron. It's index of the vertices
let faceIndexes;

// initVertices("cube") will fill the values of global variables vertices and faceIndexes.
// arguments must be string, one of "tetrahedron", "cube", etc
const initVertices = ((polyhedronName) => {
    const v = 10;
    const vo = 15;
    const gg = vo*(Math.sqrt(5)-1)/2;

    // polyData is polyhedron's vertices data.
    // It has the form
    // {
    //   tetrahedron: data,
    //   cube: data,
    //   octahedron: data
    // },
    // each data has the form {vertices:..., faces:...}

    const polyData = {
        "tetrahedron": {
            "vertices": [
                [v,v,v],
                [-v,-v,v],
                [v,-v,-v],
                [-v,v,-v]
            ],
            "faces":[
                [0,1,2],
                [0,3,1],
                [3,2,0],
                [2,3,1]
            ]
        },
        "cube": {
            "vertices": [
                [ v, v, v],
                [-v, v, v],
                [-v,-v, v],
                [ v,-v, v],
                [ v, v,-v],
                [-v, v,-v],
                [-v,-v,-v],
                [ v,-v,-v]
            ],
            "faces":[
                [0,1,2,3],
                [1,0,4,5],
                [2,1,5,6],
                [3,2,6,7],
                [0,3,7,4],
                [7,6,5,4]
            ]
        },
        "octahedron": {
            "vertices":[
                [vo,0,0],
                [0,vo,0],
                [0,0,vo],
                [0,-vo,0],
                [0,0,-vo],
                [-vo,0,0]
            ],
            "faces":[
                [0,1,2],
                [0,2,3],
                [0,3,4],
                [0,4,1],
                [5,2,1],
                [5,3,2],
                [5,4,3],
                [5,1,4],
            ]
        },
        "icosahedron": {
            "vertices":[
                [ gg, 0, vo],
                [-gg, 0, vo],
                [ gg, 0,-vo],
                [-gg, 0,-vo],
                [ 0, vo, gg],
                [ 0, vo,-gg],
                [ 0,-vo, gg],
                [ 0,-vo,-gg],
                [ vo, gg, 0],
                [ vo,-gg, 0],
                [-vo, gg, 0],
                [-vo,-gg, 0]
            ],
            "faces":[
                [0,1,4],
                [1,0,6],
                [2,3,5],
                [3,2,7],
                [4,5,8],
                [5,4,10],
                [6,7,11],
                [7,6,9],
                [8,9,0],
                [9,8,2],
                [10,11,3],
                [11,10,1],
            ]
        }
    };
    vertices = polyData[polyhedronName].vertices;
    faceIndexes = polyData[polyhedronName].faces;
});

// rotateState is a array [angleX,angleY,angleZ], means the object is rotated by angleX angleY angleZ. The angles are in degrees
// let rotateState = [0,0,0];

// getFace(j) return a array, each element is coordinate of a vertex of the face number j
const getFace = ((j) => faceIndexes[j] . map ((x) => vertices[x]) );

// rotate data around Z axis
const rotZ = (deg) => {
    const cd = Math.cos(Math.PI/180 * deg);
    const sd = Math.sin(Math.PI/180 * deg);
    vertices = vertices . map (([x,y,z]) => [
        cd * x - sd  * y ,
        sd * x + cd  * y ,
        z,
    ]);
};

// rotate data around X axis
const rotX = ((deg) => {
    const cd = Math.cos(Math.PI/180 * deg);
    const sd = Math.sin(Math.PI/180 * deg);
    vertices = vertices . map ( ([x,y,z]) => [
        x,
        cd * y - sd  * z ,
        sd * y + cd  * z,
    ]);
});

const scaleX = ((sc) => {
    vertices = vertices . map ( ([x,y,z]) => [
        sc * x,
        sc * y,
        sd * z ] ); // TODO where does `sd` come from? Remove if unused.
});

// zProj([x,y,z]) parallel projects a 3d point into 2d, by just dropping z. return [x,y]
const zProj = (([x,y,z]) => [x,y]);

// createSvgFace(j) creates a svg polygon element and return it. j is a int
const createSvgFace = ((j) => {
    const projectedFace = getFace(j). map( zProj );
    let poly = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    poly.setAttribute("points", projectedFace .toString());
    poly.setAttribute("style", `fill:none;stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);
    return poly;
});

// const setRotateState = ((key) => {
// let [x,y,z] = rotateState;
// // up arrow
// if (key.keyCode === 38) { x = (x + rotationKeyIncrement) % 360 };
// // down arrow
// if (key.keyCode === 40) { x = (x - rotationKeyIncrement) % 360 };
// // right arrow
// if (key.keyCode === 39) { z = (z + rotationKeyIncrement) % 360 };
// //if (key.Code === "ArrowRiht") { rotZ(10)};
// // left arrow
// if (key.keyCode === 37) { z = (z - rotationKeyIncrement) % 360 };
// rotateState = [x,y,z];
// console.log ( rotateState );
// });

const doKeyPress = ((key) => {
    switch(key.keyCode) {
    case 38: // up arrow;
	rotX(rotationKeyIncrement);
	break;
    case 40: // down arrow;
	rotX(-rotationKeyIncrement);
	break;
    case 39: // right arrow
	rotZ(rotationKeyIncrement);
	break;
    case 37: // left arrow
	rotZ(-rotationKeyIncrement);
	break;
    }
});

const render = () => {
    svgEl . innerHTML = "";
    faceIndexes.forEach( (x,j) => { svgEl.appendChild(createSvgFace(j)); } );
};

const init = (() => {
    initVertices(polyhedronMenu.value);
    rotX(10);
    rotZ(10);
    render();
});

init();

(function () { // "Main Game Loop" Function

    // setup events and handler

    // make arrow keys to rotate the object
    document.body.addEventListener("keydown", (keyPressed) => {
	doKeyPress(keyPressed); render();
    });

    // Rotate polyhedron with mouse
    let mousedown = false; // Initialize as false (assume mouse isn't being clicked)
    let x, y;
    svgEl.addEventListener("mousedown", (event) => { // Assumes svgEl declared...
	mousedown = true;
	x = event.clientX;
	y = event.clientY;
    });
    // Works in conjunction with `mousedown` event listener above
    svgEl.addEventListener("mouseup", (event) => { // Assumes svgEl declared...
	mousedown = false;
	render();
    });
    svgEl.addEventListener("mousemove", (event) => { // Assumes svgEl declared...
	if (mousedown) {
	    const SCALING_FACTOR = 0.1; // scale rotation so it isn't spazzy...
	    rotX((event.clientX - x) * SCALING_FACTOR); // Assume this function is accessible...
	    rotZ((event.clientY - y) * SCALING_FACTOR); // Assume this function is accessible...
	    // TODO make mouse manipulation more intuitive 
	    render();
	}
    });

    // when user select a object in menu, draw it
    polyhedronMenu.addEventListener("change", () => {
	initVertices(polyhedronMenu.value);
	rotZ(20);
	rotX(10);
	render();
	polyhedronMenu.blur();
    });

    polyhedronMenu.addEventListener("input", () => {
	initVertices(polyhedronMenu.value);
	rotZ(20);
	rotX(10);
	render();
	polyhedronMenu.blur();
    });
})();
