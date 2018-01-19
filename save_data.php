<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$jsonData = json_decode($_POST["game"], false);
$conn = connect_db("mhso_grpro");

if (!($stmt = $conn->prepare("INSERT INTO collatz_graphs(input) VALUES (?)"))) {
    http_response_code(500);
    echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
}

if (!($stmtSteps = $conn->prepare("INSERT INTO collatz_steps(graph_id, val) VALUES (?, ?)"))) {
    http_response_code(500);
    echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
}

for($i = 0; $i < count($jsonData->vertices); $i++) {
    if (!$stmt->bind_param("i", $jsonData->vertices[$i][0])) {
        http_response_code(500);
        echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    executeStmt($stmt);
    
    $id = $conn->insert_id;

    for($j = 0; $j < count($jsonData->vertices[$i]); $j++) {
        if (!$stmtSteps->bind_param("ii", $id, $jsonData->vertices[$i][$j])) {
            http_response_code(500);
            echo "Binding parameters failed: (" . $stmtSteps->errno . ") " . $stmtSteps->error;
        }
        
        executeStmt($stmtSteps);
    }
}

function executeStmt($statement) {
    if (!$statement->execute()) {
        http_response_code(500);
        echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
    }
}
?>