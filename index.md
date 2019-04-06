---
layout: home
---
## GrapAL

GrapAL (**Grap**h database of **A**cademic **L**iterature) is a tool to query the giant Semantic Scholar knowledge graph, which contains more than 40 million academic papers (currently in computer science and biomedicine). It's built using [Neo4j](https://neo4j.com/). You can run queries in Neo4j's [interactive browser](https://neo4j.com/developer/guide-neo4j-browser/) and the simple pattern-matching [Cypher query language](https://neo4j.com/developer/cypher-query-language/)

The easiest way to get started with GrapAL is through the interactive browser, which you can use to write and visualize queries.

We also have a handy query loader that can be used to load, share, and save the results of queries. Find it at https://allenai.github.io/grapal-website/app/

![Visual of the shortest paths between Swabha Swayamdipta and Regina Barzilay](https://allenai.github.io/grapal-website/assets/images/browser-example.png)

For starters, copy and paste the following query into the [interactive browser](https://grapal.allenai.org:7473/browser):
```
MATCH p=shortestPath((a:Author)-[:AUTHORS*0..6]-(b:Author)) 
WHERE a.first = "Swabha" 
    AND a.last = "Swayamdipta"
    AND b.first = "Regina" 
    AND b.last = "Barzilay"
RETURN p
```
You should see a path of nodes and edges connecting the two researchers! 

In the following sections, we'll outline some example queries for those who want to get the ball rolling followed by a guide to getting started with Cypher and GrapAL.
