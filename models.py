from peewee import *

db = SqliteDatabase('books.db')

class Book(Model):
    title = CharField()
    author = CharField()

    class Meta:
        database = db

def create_tables():
    db.connect()
    db.create_tables([Book], safe=True)

if __name__ == '__main__':
    create_tables()
