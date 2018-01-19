SELECT MAX(s2.r) AS maxratio, input, c1 FROM 
(SELECT c1/input AS r, input, c1 FROM 
(SELECT Count(*) AS c1, input FROM collatz_graphs cg, collatz_steps WHERE cg.id = graph_id 
GROUP BY input, graph_id) s1) s2;