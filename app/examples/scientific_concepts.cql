MATCH path=shortestPath((er:Entity {name: 'Estrogen Receptors'})-[:WITH_ENTITY*0..15]-(ar:Entity {name: 'Arimidex'})) 
WITH nodes(path) as ns UNWIND ns as n 
MATCH (n)-[:WITH_ENTITY]->(e0:Entity), 
(n)-[:WITH_ENTITY]->(e1:Entity), 
(n)-[:WITH_RELATIONSHIP]->(r:Relation) 
RETURN e0, r, e1