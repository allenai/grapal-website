MATCH (p1:Paper)-[:APPEARS_IN]->(naacl:Venue), 
(p2:Paper)-[:APPEARS_IN]->(cvpr:Venue), 
path=((p1)-[:CITES]->(p2)) 
WHERE naacl.text =~ '.*NAACL.*' 
AND cvpr.text =~ '.*CVPR.*' 
RETURN count(path)