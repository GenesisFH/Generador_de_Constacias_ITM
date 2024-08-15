from flask import Flask, flash, jsonify, redirect, render_template, request, session, url_for
from config import config
app = Flask(__name__)
@app.route("/")
def index():
    return redirect("login")

@app.route("/login")
def login():
    return render_template("auth/login.html")

@app.route("/main")
def main():
    return render_template("main.html")

@app.route("/constancias", methods=["GET", "POST"])
def constancias():
    return render_template("constancias.html")

@app.route("/crud-usuarios")
def crudUsuarios():
    return render_template("crudUsuarios.html")

@app.route("/usuarios")
def usuarios():
    return render_template("usuarios.html")
    

if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.run()
