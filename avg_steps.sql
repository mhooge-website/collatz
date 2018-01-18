SELECT AVG(DISTINCT s.c) AS avg_steps FROM (SELECT Count(*) AS c FROM collatz_graphs gr, collatz_steps WHERE graph_id = gr.id 
GROUP BY graph_id) s;