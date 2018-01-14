var vertices;

function calculate(inputId) {
    var div = document.getElementById("main-div");
    try {
        var children = document.getElementsByClassName("result")
        let amount = children.length;
        for(i = 0; i < amount; i++) {
            div.removeChild(children.item(0));
        }
    }
    catch(e) {}

    var inputArr;
    try {
        inputArr = parseInput(inputId);
    }
    catch(e) {
        var text = document.createElement("p");
        text.textContent = e.message;
        text.id = "error-label";
        div.insertBefore(text, div.lastChild);
        return;
    }

    var drawResultGraph = inputArr.length == 1;

    if(drawResultGraph) vertices = new Array(Math.ceil(inputArr[0]/10 + 10));

    for(i = 0; i < inputArr.length; i++) {
        var progress = inputArr[i];
        var counter = 0;
        while(progress > 1) {
            if(drawResultGraph) vertices.push(progress);
            if(progress % 2 == 1) progress = (progress * 3) + 1;
            else progress /= 2;
            if(counter % 1000 == 0) console.log(progress);
            counter++;
        }

        var text = document.createElement("p");
        text.className = "result";
        text.innerHTML = "<span id='input-label'>" + inputArr[i] + "</span> reached " + progress + " in <a id='steps-label' href='localhost:8000/projects/collatz/10'>" + counter + "</a> steps.";
        div.insertBefore(text, div.lastChild);
    }
    
    if(drawResultGraph) drawGraph(vertices);
}

function parseInput(inputId) {
    var type = "single";
    var values = document.getElementById(inputId).value;
    if(values.length == 0) throw new DOMException("Input Empty.");
    if(values.includes('-')) type = "range";
    else if(values.includes(',')) type = "list";

    try {
        let arr;
        if(type == "single") arr = [values];
        else if(type == "range") arr = extractRange(values);
        else if(type == "list") arr = extractList(values);
        return arr;
    }
    catch(e) {
        throw e;
    }
}

function extractRange(values) {
    let arr = values.split("-");
    let start = parseInt(arr[0].trim());
    let end = parseInt(arr[1].trim());

    if(typeof(start) != "number" || typeof(end) != "number" || start > end) throw new DOMException("Invalid Input.");
    else if(start == end) return new Array()[start];

    let resultArr = new Array(end-start);
    var i = 0;
    for(val = start; val < end; val++) {
        resultArr[i] = val;
        i++;
    }
    return resultArr;
}

function extractList(values) {
    let arr = values.split(",");
    let resultArr = new Array(arr.length);
    for(i = 0; i < arr.length; i++) {
        let val = parseInt(arr[i].trim());
        if(typeof(val) != "number") throw new DOMException("Invalid Input.");
        resultArr[i] = val;
    }
    return resultArr;
}

function displayInfo(display) {
    document.getElementById("help-div").style.display = display ? "block" : "none";
}

function clearErrorMsg() {
    try {
        document.getElementById("main-div").removeChild(document.getElementById("error-label"));
    }
    catch(e) {

    }
}