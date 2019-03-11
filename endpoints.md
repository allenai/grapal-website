---
layout: page
title: Endpoints
---
Endpoints
---------
In this section, we outline different means of accessing/interacting with GrapAL.

### Interactive Browser
Neo4j's interactive browser is available at [grapal.allenai.org:7474/browser](grapal.allenai.org:7474/browser). It produces neat visualizations and allows users to click around and explore the graph.
![Visual of the shortest paths between Amandalynne Paullada and Marti Hearst](https://allenai.github.io/grapal-website/assets/images/shortest_path.png)
all shortest paths between Amandalynne Paullada and Marti Hearst


### HTTP Endpoint
Documentation of the Neo4j HTTP API available [here](https://neo4j.com/docs/http-api/current/http-api/introduction/). The HTTP endpoint allows for faster queries that return bulk JSON data. Note that _Cypher queries may not include line breaks_ as many of the above examples do.

We have an (imperfect) example javascript app using ajax at [grapal.allenai.org/app/](grapal.allenai.org/app/) with the source code available [here](https://github.com/allenai/grapal-website/blob/master/app/index.html#L49).

### Language Drivers
Finally, Neo4j has quite a few language drivers with more details [here](https://neo4j.com/docs/driver-manual/1.7/get-started/). The bolt address for GrapAL is `grapal.allenai.org:7687`.
