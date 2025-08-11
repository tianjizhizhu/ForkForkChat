from flask import Flask, render_template, request, redirect
from models import Book, create_tables

app = Flask(__name__)

create_tables()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        title = request.form.get("title").strip()
        author = request.form.get("author").strip()

        if title and author:
            Book.create(title = title, author = author) #peewee写入
        else:
            pass
        
        return redirect("/")

    books = Book.select().order_by(Book.id.desc())

    return render_template("index.html",books=books)

@app.route("/delete/<int:book_id>", methods=["POST"])
def delete_book(book_id):
    try:
        book = Book.get_by_id(book_id)
        book.delete_instance()
        print(f"删除成功")
    except Book.DoesNotExist:
        print("删除失败")

    return redirect('/')



if __name__ == "__main__":
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))