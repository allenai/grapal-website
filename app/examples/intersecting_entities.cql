MATCH (p:Paper)-[:MENTIONS]->(e1:Entity {name: 'Constraint programming'}), 
(p:Paper)-[:MENTIONS]->(e2:Entity {name: 'Natural language processing'}) 
RETURN p