## GrapAL

GrapAL (**Grap**h database of **A**cademic **L**iterature) is a tool to query the giant Semantic Scholar knowledge graph, which contains more than 40 million academic papers (currently in computer science and biomedicine). It's built using [Neo4j](https://neo4j.com/). You can run queries in Neo4j's [interactive browser](https://neo4j.com/developer/guide-neo4j-browser/) and the simple pattern-matching [Cypher query language](https://neo4j.com/developer/cypher-query-language/)

For starters, copy and paste the following query into the [interactive browser](http://grapal.allenai.org:7474/browser):
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

Example Queries
---------
We'll outline some interesting use cases of GrapAL; to make them your own simply replace the example authors, entities, or papers with your own!

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

GrapAL Schema
---------
A brief overview of the schema of GrapAL.
![GrapAL Schema: Graph of nodes and edges outlined in text below](schema.png)
overview of the schema where * indicates indexed property.

### Node types
- **Affiliation**: Usually some form of institution (not normalized or queryable by location).
  - text: a long string of the full affiliation
- **Author**
  - author_id: standard integer author id as can be found in the URL of an author page on semanticscholar.org
  - first: string of an author's first name
  - middle: string of an author's middle names (currently formatted as "['middle_name1', 'middle_name2']", but will be an actual array in the future)
  - last: string of an author's last name
- **Entity**
  - entity_id: standard integer entity id as can be found in the URL of an entity page on semanticscholar.org
  - name: string of an entity name
- **Paper**
  - paper_id: standard string paper id as can be found in the URL of a paper page on semanticscholar.org
  - title: string of a paper title
  - year: integer of the year a paper was published
- **Relation_Instance**: a simple node acting as a hyperedge; connects a Relation_Type and the entities it relates
- **Relation_Type**: the type of relationship two entities have (i.e. 'is_child_of')
  - relation_type: string of a relation type
  - relation_subtype: string of a relation's subtype if one exists (i.e. 'is_child_of' subtype is 'isa')
- **Venue**: journal, conference, or institution in which a paper is published
  - text: string of a venue

### Edge types
- **AFFILIATED_WITH**: relationship between an Author or Paper and an Affiliation
  - year: integer year the affiliation existed (based on when a given paper was published)
- **APPEARS_IN**: relationship between a Paper and a Venue
- **AUTHORS**: relationship between an Author and a Paper
  - position: integer for an Author's position on a Paper
- **CITES**: citation relationship between a Paper and another Paper
- **MENTIONS**: relationship between a Paper and an Entity
  - confidence: float representing confidence of an Entity in a Paper
  - salience: float representing salience of an Entity in a Paper
- **MENTIONS_RELATION**: relationship between a Paper and a Relation_Instance
  - text: string of a venue
- **WITH_ENTITY**: relationship between a Relation_Instance and an Entity
- **WITH_RELATIONSHIP**: relationship between a Relation_Instance and a Relation_Type


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
 
Endpoints
---------
In this section, we outline different means of accessing/interacting with GrapAL.

### Interactive Browser
Neo4j's interactive browser is available at [grapal.allenai.org:7474/browser](grapal.allenai.org:7474/browser). It produces neat visualizations and allows users to click around and explore the graph.
![Visual of the shortest paths between Amandalynne Paullada and Marti Hearst](shortest_path.png)
all shortest paths between Amandalynne Paullada and Marti Hearst


### HTTP Endpoint
Documentation of the Neo4j HTTP API available [here](https://neo4j.com/docs/http-api/current/http-api/introduction/). The HTTP endpoint allows for faster queries that return bulk JSON data. Note that _Cypher queries may not include line breaks_ as many of the above examples do.

We have an (imperfect) example javascript app using ajax at [grapal.allenai.org/app/](grapal.allenai.org/app/) with the source code available [here](https://github.com/allenai/grapal-website/blob/master/app/index.html#L49).

### Language Drivers
Finally, Neo4j has quite a few language drivers with more details [here](https://neo4j.com/docs/driver-manual/1.7/get-started/). The bolt address for GrapAL is `grapal.allenai.org:7687`.

FAQ
---------
Q: Does GrapAL contain all data from [SemanticScholar.org](SemanticScholar.org)?
A: GrapAL is a static snapshot of Semantic Scholar, updated at a monthly cadence. The current snapshot is from 1/28/2019.

Contact
---------
If you run into any problems or have questions about GrapAL, the grapal-website github repo is where you can report them. Also feel free to email `grapal` at `allenai.org`.

