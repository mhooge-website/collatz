var vertices;

function calculate(startPoint) {
    vertices = new Array(number/10);
    var progress = startPoint;
    var counter = 0;
    while(progress > 1) {
        vertices.push(progress);
        if(progress % 2 == 1) progress = (progress * 3) + 1;
        else progress /= 2;
        if(counter % 1000 == 0) console.log(progress);
        counter++;
    }

    document.write(startPoint + " reached " + progress + " in " + counter + " steps.");
    drawGraph(vertices);
}