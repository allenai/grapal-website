
from neo4j import GraphDatabase
import json

class PyDriver(object):

    def __init__(self, uri, user="neo4j", password="neo4j"):
        self._driver = GraphDatabase.driver(uri)

    def close(self):
        self._driver.close()

    def print_greeting(self):
        with self._driver.session() as session:
            greeting = session.write_transaction(self._create_and_return_greeting)
            print(greeting)
            for record in greeting:
                #r = json.loads(record['title'])
                items = record.items()
                for item in items[0][1]:
                    print(item['title'])

                print()
            # for greet in greeting:
            #     print(f'{greet.items()[0][1]} {greet.items()[1][1]}')
            #print(greeting)

    @staticmethod
    def _create_and_return_greeting(tx):
        result = tx.run("MATCH (p1:Paper)-[:MENTIONS]->(naacl:Entity) " 
            "WHERE naacl.name =~ \"(?i)Relationship extraction.*\" "
            "with COLLECT({title: p1.title, year: p1.year, id: p1.id}) as jsonOutput "
            "RETURN jsonOutput")
        return result
