MATCH p=shortestPath((a:Author)-[:AUTHORS*0..6]-(b:Author)) 
WHERE a.first = 'Swabha' 
AND a.last = 'Swayamdipta' 
AND b.first = 'Regina' 
AND b.last = 'Barzilay' 
RETURN p