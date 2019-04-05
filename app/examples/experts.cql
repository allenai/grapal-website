MATCH (a:Author)-[:AUTHORS]->(p:Paper), 
(p)-[:MENTIONS]->(:Entity {name: 'Relationship extraction'}) 
WHERE p.year > 2013 
WITH a, count(p) as cp 
RETURN a, cp 
ORDER BY cp DESC