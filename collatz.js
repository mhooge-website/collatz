var highlightedButton;

function calculate(inputId) {
    var div = document.getElementById("main-div");
    clearResults();

    var inputArr;
    try {
        inputArr = parseInput(inputId);
    }
    catch(e) {
        showErrrorMsg(div, e.message);
        return;
    }

    vertices = new Array(inputArr.length);
    var maximums = new Array(inputArr.length);
    if(inputArr.length > 1) {
        let multiDiv = createMultiInputDiv(vertices);
        
        for(let i = 0; i < inputArr.length; i++) {
            if(inputArr[i] < 2) continue;
            let value = calculateCollatzValue(inputArr[i], vertices, maximums, i);

            let button = document.createElement("button");
            button.addEventListener("click", () => {resultButtonSelected(button, vertices[i], maximums[i]);});
            button.className = "result-button";
            button.textContent = ""+inputArr[i];
            multiDiv.appendChild(button);
            if(i == 0) resultButtonSelected(button, vertices[i], maximums[i]);
        }
        document.body.insertBefore(multiDiv, document.getElementById("result-tooltip"));
    }
    else {
        if(inputArr < 2) {
            showErrrorMsg(div, "Input must be larger than 1");
            return
        }
        let value = calculateCollatzValue(inputArr[0], vertices, maximums, 0);

        setResultTooltip(inputArr[0], value, vertices[0].length);
    }
    drawGraph(vertices[0], maximums[0]);
}

function showErrrorMsg(div, message) {
    var text = document.createElement("p");
    text.textContent = message;
    text.id = "error-label";
    div.appendChild(text);
}

function setResultTooltip(input, value, steps) {
    showResultTooltip(true);
    var text = document.getElementById("result-tooltip");
    text.innerHTML = "<span id='input-label'>" + input + "</span> reached " + value + " in <span id='steps-label'>" + steps + "</span> steps.";
}

function showResultTooltip(show) {
    document.getElementById("result-tooltip").style.display = show ? "block" : "none";
}

function calculateCollatzValue(value, vertices, maximums, i) {
    var max = 0;
    vertices[i] = new Array();
    var nextVal = value;
    var counter = 0;
    vertices[i].push(nextVal);
    while(nextVal > 1) {
        if(nextVal > max) max = nextVal;
        if(nextVal % 2 == 1) nextVal = (nextVal * 3) + 1;
        else nextVal /= 2;
        counter++;
        vertices[i].push(nextVal);
    }
    maximums[i] = max;
    return nextVal;
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

function createMultiInputDiv(vertices) {
    let div = document.createElement("div");
    div.className = "result";

    return div;
}

function clearResults() {
    try {
        var children = document.getElementsByClassName("result")
        let amount = children.length;
        for(i = 0; i < amount; i++) {
            document.body.removeChild(children.item(0));
        }
    }
    catch(e) { console.log("Error"); }
}

function resultButtonSelected(button, vertices, max) {
    if(highlightedButton != null) highlightedButton.style.borderColor = button.style.borderColor;
    highlightedButton = button;
    button.style.borderColor = "red";

    setResultTooltip(button.textContent, vertices[vertices.length-1], vertices.length);

    drawGraph(vertices, max);
}

function keyPressed(e) {
    if(e.key == "Enter") calculate("number-input");
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