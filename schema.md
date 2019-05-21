---
layout: page
title: GrapAL Schema
---
GrapAL Schema
---------
A brief overview of the schema of GrapAL.
![GrapAL Schema: Graph of nodes and edges outlined in text below](https://allenai.github.io/grapal-website/assets/images/schema.png)
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
- **WITH_ENTITY**: relationship between a Relation_Instance and an Entity
- **WITH_RELATIONSHIP**: relationship between a Relation_Instance and a Relation_Type

