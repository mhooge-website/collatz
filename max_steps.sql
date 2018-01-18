SELECT DISTINCT input, MAX(sp.co) FROM 
(SELECT Count(*) AS co FROM collatz_graphs gra, collatz_steps WHERE gra.id = graph_id GROUP BY gra.id) sp, collatz_graphs WHERE 
(SELECT MAX(s.c) FROM
(SELECT Count(*) AS c FROM collatz_graphs gr, collatz_steps WHERE gr.id = graph_id GROUP BY gr.id) s) = 
(SELECT Count(*) FROM collatz_steps WHERE graph_id = collatz_graphs.id);