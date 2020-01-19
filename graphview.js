var canvas;

function drawGraph(vertices, max) {
    initializeCanvas();
    clearGraph();
    console.log(vertices);

    if(max < 50) canvas.height = 50;
    else if(max < window.innerHeight * 0.75) canvas.height = max;
    else canvas.height = window.innerHeight * 0.7;
    canvas.width = 5 + vertices.length * 20;
    var ratio = (canvas.height-30)/max;

    setFont("10px serif");
    var yOffset = canvas.height-10;
    let string = ""+vertices[0];
    let stringStartX = 0;
    let stringStartY = (yOffset-vertices[0]*ratio);
    if(vertices[0] % 2 != 0 || vertices[0] == max) stringStartY += 10;
    else stringStartY -= 10;
    fillString(string, stringStartX, stringStartY);
    for(i = 1; i < vertices.length; i++) {
        let y1 = yOffset-vertices[i-1]*ratio;
        let y2 = yOffset-vertices[i]*ratio;

        drawLine(5 + (i-1) * 20, y1, 5 + i * 20, y2);
        if(y1 > y2) fillString(""+vertices[i], 5 + i * 20 - 5, y2-10);
        else fillString(""+vertices[i], i * 20 - 5, y2+10);
    }
}

function clearGraph() {
    if(canvas != null && canvas.style.display == "block") {
        eraseAll(canvas);
    }
}

function initializeCanvas() {
    displayCanvas(true);
    canvas = document.getElementById("canvas");
    
    setHelperContext(canvas.getContext("2d"));
}

function displayCanvas(display) {
    document.getElementById("canvas").style.display = display ? "block" : "none";
}