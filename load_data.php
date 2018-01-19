<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$conn = connect_db("mhso_grpro");

function pct_done($conn) {
    $res1 = $conn->query("SELECT c2/c1 FROM 
    (SELECT Count(DISTINCT input) AS c1 FROM collatz_graphs cg, collatz_steps WHERE cg.id = graph_id) s, 
    (SELECT Count(DISTINCT input) AS c2 FROM collatz_graphs) g");
    if($res1->num_rows > 0) {
        return $res1->fetch_all();
    }
    return "empty";
}

function max_steps($conn) {
    $res2 = $conn->query("SELECT DISTINCT MAX(sp.co), input FROM 
    (SELECT Count(*) AS co FROM collatz_graphs gra, collatz_steps WHERE gra.id = graph_id GROUP BY gra.id) sp, collatz_graphs WHERE 
    (SELECT MAX(s.c) FROM
    (SELECT Count(*) AS c FROM collatz_graphs gr, collatz_steps WHERE gr.id = graph_id GROUP BY gr.id) s) = 
    (SELECT Count(*) FROM collatz_steps WHERE graph_id = collatz_graphs.id)");
    
    if($res2->num_rows > 0) {
        return $res2->fetch_all();
    }
    return "empty";
}

function avg_steps($conn) {
    $res3 = $conn->query("SELECT AVG(DISTINCT s.c) FROM (SELECT Count(*) AS c FROM collatz_graphs gr, collatz_steps WHERE graph_id = gr.id 
    GROUP BY graph_id) s");
    
    if($res3->num_rows > 0) {
        return $res3->fetch_all();
    }
    return "empty";
}

function max_ratio($conn) {
    $res4 = $conn->query("SELECT MAX(s2.r) AS maxratio, input, c1 FROM 
    (SELECT c1/input AS r, input, c1 FROM 
    (SELECT Count(*) AS c1, input FROM collatz_graphs cg, collatz_steps WHERE cg.id = graph_id 
    GROUP BY input, graph_id) s1) s2;");

    if($res4->num_rows > 0) {
        return $res4->fetch_all();
    }
    return "empty";
}

function total_graphs($conn) {
    $res5 = $conn->query("SELECT Count(DISTINCT input) FROM collatz_graphs");
    if($res5->num_rows > 0) {
        return $res5->fetch_all();
    }
    return "empty";
}

$val_total_graphs = total_graphs($conn);
$val_pct_done = pct_done($conn);
$val_max_steps = max_steps($conn);
$val_avg_steps = avg_steps($conn);
$val_max_ratio = max_ratio($conn);

$jsonarr = array($val_total_graphs, $val_pct_done, $val_max_steps, $val_avg_steps, $val_max_ratio);
echo json_encode($jsonarr);
?>