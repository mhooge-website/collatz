var highlightedButton;
var debug = false;

function init() {
    loadGraphStats();
}

function loadGraphStats() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let resArr = JSON.parse(this.responseText);

            let statNodes = document.getElementsByClassName("stats-values");
            let splitArrMax = (""+resArr[2][0]).split(",");
            let splitArrRatio = (""+resArr[4][0]).split(",");
            let pct = parseInt(resArr[1][0]) * 100;
            let avg = parseInt(resArr[3][0]);

            statNodes[0].textContent = statNodes[0].textContent.replace("{graphs_total}", resArr[0][0]);
            statNodes[1].textContent = statNodes[1].textContent.replace("{pct_done}", pct + "%");
            statNodes[2].textContent = statNodes[2].textContent.replace("{max_steps}", splitArrMax[0]);
            statNodes[3].textContent = statNodes[3].textContent.replace("{input_max}", splitArrMax[1]);
            statNodes[4].textContent = statNodes[4].textContent.replace("{avg_steps}", avg);
            statNodes[5].textContent = statNodes[5].textContent.replace("{ratio}", splitArrRatio[0]);
            statNodes[6].textContent = statNodes[6].textContent.replace("{input_ratio}", splitArrRatio[1]);
            statNodes[7].textContent = statNodes[7].textContent.replace("{step_ratio}", splitArrRatio[2]);
        }
        else if(this.state == 500) console.log("Error saving graph: " + this.responseText);
    };

    request.open("POST", "/projects/collatz/load_data.php", true);
    request.send();
}

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

    var vertices = new Array(inputArr.length);
    var maximums = new Array(inputArr.length);
    if(inputArr.length > 1) {
        let multiDiv = createMultiInputDiv(vertices);
        let overflow = document.createElement("div");
        overflow.id = "overflow-div";

        for(let i = 0; i < inputArr.length; i++) {
            if(inputArr[i] < 2) continue;
            let value = calculateCollatzValue(inputArr[i], vertices, maximums, i);

            let button = document.createElement("button");
            button.addEventListener("click", () => {resultButtonSelected(button, vertices[i], maximums[i]);});
            button.className = "result-button";
            button.textContent = ""+inputArr[i];
            overflow.appendChild(button);
            multiDiv.appendChild(overflow);
            if(i == 0) resultButtonSelected(button, vertices[i], maximums[i]);
        }
        document.body.insertBefore(multiDiv, document.getElementById("result-tooltip"));
    }
    else {
        let value = calculateCollatzValue(inputArr[0], vertices, maximums, 0);

        setResultTooltip(inputArr[0], value, vertices[0].length);
    }
    if(!debug) saveVertices(vertices);
    let drawIndex = 0;
    while (vertices[drawIndex] == undefined) {
        drawIndex++;
    }
    drawGraph(vertices[drawIndex], maximums[drawIndex]);
}

function saveVertices(vertices) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        if(this.status == 500) console.log("Error saving graph: " + this.responseText);
    };

    var val = {"vertices":vertices};
    var json = JSON.stringify(val);

    request.open("POST", "/projects/collatz/save_data.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("game="+json);
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
        
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < 2) throw new  DOMException("All input must be larger than 1");
        }

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

function displayStats(display) {
    document.getElementById("stats-div").style.display = display ? "block" : "none";
}

function clearErrorMsg() {
    try {
        document.getElementById("main-div").removeChild(document.getElementById("error-label"));
    }
    catch(e) {

    }
}