---
layout: page
title: Cypher Basics
---
Cypher Basics
---------
Cypher is Neo4j's graph query language. It relies on pattern-matching queries and has similar syntax to relational query languages.
In this section, we'll give a brief introduction to using Cypher and provide resources to go a little deeper.
- [Cypher Basics 1](https://neo4j.com/developer/cypher-query-language/): simple intro to Cypher
- [Cypher Refacrd](https://neo4j.com/docs/cypher-refcard/current/): a handy overview of features

To begin by fetching an arbitrary node, we would run:
```
MATCH (a) RETURN a LIMIT 1
```
Note that casing is not sensitive for keywords, so we could also write `match (a)...`
We limit to 1 because otherwise we'll be doing a scan of all 700M+ nodes in GrapAL

To break this query down even more, we note that `()` indicate a node type, whereas if we wanted to do a pattern-matching query on an edge type, we'd write `()-[]-()`. The `a` is the name of the node variable.

We can further specify the type of node we wish to return using the above schema:
```
MATCH (a:Author) RETURN a LIMIT 1
```
Node/edge types are case sensitive

Next, we can elaborate upon the node/edge syntax above to get a node of type `Author` and of type `Paper`, where the `Author` `AUTHORS` the `Paper`:
```
MATCH (a:Author)-[:AUTHORS]->(p:Paper) RETURN * LIMIT 10
```
This will return to us 1 `Author` node and up to 10 `Paper`s they have `AUTHORED`. The `*` means we want to return all of the named values in the query, but we could also `RETURN a, p LIMIT 10`.

We can also specify properties in our pattern-matching queries:
```
MATCH (a:Author {last: 'Berendse'}) RETURN *
```
And we can specify more properties with:
```
MATCH (a:Author {last: 'Berendse', first: 'Kevin'}) RETURN *
```

This is where it's particularly important to consider indexed values. We don't want to search on `paper_id` directly, instead we can start with an indexed property, like `author_id` and then limit it to a `Paper` node with a given `paper_id`.

Say we want to fetch [Latanya Sweeney](https://www.semanticscholar.org/author/Latanya-Sweeney/2714368)'s paper ["k-Anonymity: A Model for Protecting Privacy"](https://www.semanticscholar.org/paper/k-Anonymity%3A-A-Model-for-Protecting-Privacy-Sweeney/153dc4d5f2fbd233fec32b8e102f9a7128feed53). Fetching her `author_id` from her author page URI and the `paper_id` from its URI, we can formulate the following query:
```
MATCH (a:Author {author_id: 2714368})-[:AUTHORS]->(p:Paper {paper_id: '153dc4d5f2fbd233fec32b8e102f9a7128feed53'}) RETURN p
```
This gets us the node we were searching for much more quickly than doing a scan for all (unindexed) `paper_id` values.

Finally, one of the places GrapAL shines is in finding shortest paths. We can run the following to find the shortest path between two researchers:
```
MATCH p=shortestPath(
 (a:Author)-[:AUTHORS*0..6]-
 (b:Author)) 
 WHERE a.first = "Amandalynne" 
 AND a.last = "Paullada"
 AND b.first = "Marti" 
 AND b.last = "Hearst"
 RETURN p
 ```
 We can run simply `shortestPath` or `allShortestPaths` depending on how many paths we want!
 The `[:AUTHORS*0..6]` specifies the maximum length of the shortest path; we don't want this to be too big to avoid running into memory issues.
 
 This example query also introduces an alternative property specification syntax.
