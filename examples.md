---
layout: page
title: Example Queries
---
Example Queries
---------
We'll outline some interesting use cases of GrapAL; to make them your own simply replace the example authors, entities, or papers with your own!

Copy these over into the [interactive browser](https://grapal.allenai.org:7473/browser) to visualize the results and explore the graph further!

### Shortest path between researchers
The following finds the shortest path between two researchers based on their coauthors using the shortest path function. We could alternatively use `allShortestPaths` to return more than one (if they exist). We can alternatively use researcher IDs based on the URL of their Semantic Scholar page ([Swabha Swayamdipta](https://www.semanticscholar.org/author/Swabha-Swayamdipta/2705113): `2705113`), with `(a:Author {author_id: 2705113})`.

```
MATCH p=shortestPath((a:Author)-[:AUTHORS*0..6]-(b:Author)) 
WHERE a.first = "Swabha" 
    AND a.last = "Swayamdipta"
    AND b.first = "Regina" 
    AND b.last = "Barzilay"
RETURN p
```

### Authors publishing the most on an entity
The following finds the authors who have published the most on "Relationship extraction" since 2013. This query is explained further in the [demo video](https://www.youtube.com/watch?v=1ivX9sHw2RU).
```
MATCH (a:Author)-[:AUTHORS]->(p:Paper),
    (p)-[:MENTIONS]->
    (:Entity {name: "Relationship extraction"})
WHERE p.year > 2013
WITH a, count(p) as cp
RETURN a, cp 
ORDER BY cp DESC 
```
Furthermore, because entities are stored as casing-specific strings, we can find the canonicalized entity we're looking for with the following query.
```
MATCH (e:Entity)
WHERE e.name =~ "(?i)relationship extraction.*"
RETURN e 
```

### Papers discussing multiple entities
This query gives us papers that mention both contraint programming and NLP. A more interesting query could be accomplished based on an entity's salience in a paper, which lives on `:MENTIONS` edges.

```
MATCH (p:Paper)-[:MENTIONS]->
    (e1:Entity {name: "Constraint 
        programming"}),
    (p:Paper)-[:MENTIONS]->
    (e2:Entity {name: "Natural language 
        processing"}) 
RETURN p
```

### Impact of one biomedical entity on another
The following gives us the shortest path between the entities "Estrogen Receptors" and "Arimidex" based on relationships. It unwinds the resulting path to pull in the type of relation that exists between each pair of related nodes in the shortest path.

```
MATCH path=shortestPath(
    (er:Entity {name: "Estrogen 
        Receptors"})-
    [:WITH_ENTITY*0..15]-
    (ar:Entity {name: "Arimidex"}))
WITH nodes(path) as ns
UNWIND ns as n
MATCH (n)-[:WITH_ENTITY {position: 0}]->
    (e0:Entity),
    (n)-[:WITH_ENTITY {position: 1}]->
        (e1:Entity),
    (n)-[:WITH_RELATIONSHIP]->
        (r:Relation) 
RETURN e0, r, e1
```

### Citation impact of one conference on another
This query returns the number of papers in one conference cited by those in another. This could be extended to different domains, affiliations, or authors. We use regular expression matching because venues are non-deduplicated strings.

```
MATCH (p1:Paper)-[:APPEARS_IN]->
    (naacl:Venue),
(p2:Paper)-[:APPEARS_IN]->(cvpr:Venue),
path=((p1)-[:CITES]->(p2)) 
WHERE naacl.text =~ ".*NAACL.*" 
AND cvpr.text =~ ".*CVPR.*" 
RETURN count(path)
```

### Shortest path excluding certain nodes
Occasionally a shortest path query will return a path that fails to provide useful information (i.e. two papers that both mention "Experiments"). If this happens, creating a simple list of excluded nodes or constraining the path to only paths longer than some number of edges should provide more interesting results.

```
MATCH (excluded:Entity) 
WHERE excluded.name in ['Genetic Translation Process', 'Muscle Cells', 'Cell Differentiation process']
WITH collect(excluded) as excluded
MATCH path=shortestPath((mdm2:Entity {name: 'MDM2 gene'})-
  [:MENTIONS|:CITES*0..6]-
  (n1:Entity {name: 'Neuregulin 1'})) 
WHERE length(path) > 5
AND none (n in nodes(path) where n in excluded)
RETURN path limit 1
```

### Researchers who cite you who you've not cited
This query returns authors who cite a given author who that author has not cited. This is perhaps a means of finding collaborators, but at the very least an interesting example of multiple aggregations.

```
MATCH (a1:Author {author_id: 1941113})-[:AUTHORS]->(p1:Paper), 
  (a2:Author)-[:AUTHORS]->(p2:Paper), 
  (p1)-[c:CITES]->(p2) 
WITH a1, collect(distinct a2) as cited_authors
MATCH (a1)-[:AUTHORS]->(p1:Paper),
  (a2:Author)-[:AUTHORS]->(p2:Paper),
  (p2)-[c:CITES]->(p1)
WHERE NOT (a1)-[:AUTHORS]->(p2) 
AND NOT (a2)-[:AUTHORS]->(p1) 
AND NOT a2 IN cited_authors
WITH a1, a2, count(c) as count_c 
RETURN a1, a2, count_c
ORDER BY count_c DESC limit 2
```

### Authors who have cited a given author most
This returns the authors who have cited a given author the most. Note that this contians a cartesian product & could probably be written better.

```
MATCH (a:Author {author_id: 40504232})-[:AUTHORS]->(p:Paper),
       (b:Author)-[:AUTHORS]->(p2:Paper),
       (p)-[c:CITES]->(p2)
WHERE NOT (b)-[:AUTHORS]->(p)
WITH b, count(c) as count_c 
RETURN b, count_c 
ORDER BY count_c DESC
```
