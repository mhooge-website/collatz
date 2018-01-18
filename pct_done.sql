SELECT c2/c1 FROM 
(SELECT Count(DISTINCT input) AS c1 FROM collatz_graphs cg, collatz_steps WHERE cg.id = graph_id) s, 
(SELECT Count(DISTINCT input) AS c2 FROM collatz_graphs) g;