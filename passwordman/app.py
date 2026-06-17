from flask import Flask, render_template, request , redirect, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "change_secrete_key"

DB = "passwords.db"

def init_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )                
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS vault (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            website TEXT,
            site_username TEXT,
            site_password TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()



@app.route('/')
def home():
    if "user_id" in session:
        return redirect('/dashboard')
    return redirect('/login')

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = generate_password_hash(request.form["password"])
        
        try:
            conn = sqlite3.connect(DB)
            cur = conn.cursor()
            
            cur.execute(
                "INSERT INTO users(username, password) VALUES(?, ?)", (username,  password)
            )
            
            conn.commit()
            conn.close()
            
            flash("Registration successful!")
            return redirect("/login")
        except:
            flash("Username already exists!")
    return render_template("register.html")

@app.route("/login",  methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        
        conn = sqlite3.connect(DB)
        cur = conn.cursor()
        
        cur.execute(
            "SELECT id, password FROM users WHERE username =?", (username,)
        )
        
        user = cur.fetchone()
        conn.close()
        
        if user and check_password_hash(user[1], password):
            session["user_id"] = user[0]
            session["username"] = username
            return redirect("/dashboard")
        flash("Invalid login!")
    return render_template("login.html")

@app.route("/dashboard",  methods=["GET", "POST"])
def dashboard():
    if "user_id" not in session:
        return redirect("/login")
    if request.method == "POST":
        website = request.form["website"]
        site_username = request.form["site_username"]
        site_password = request.form["site_password"]
        
        conn = sqlite3.connect(DB)
        cur = conn.cursor()
        
        cur.execute("""
        INSERT INTO vault(user_id, website, site_username, site_password)
        VALUES (?,?,?,?)
        """,(
            session["user_id"],
            website,
            site_username,
            site_password
        ))
        
        conn.commit()
        conn.close()
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    
    cur.execute("""
    SELECT id, website, site_username, site_password
    FROM vault
    WHERE user_id=?
    """, (session["user_id"],))
    
    passwords = cur.fetchall()
    conn.close()
    
    return render_template("dashboard.html", passwords=passwords, username=session["username"])

@app.route("/delete/<int:id>")
def delete(id):
    if "user_id" not in session:
        return redirect("/login")
    
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    
    cur.execute(
        "DELETE FROM vault WHERE id=?", (id,)
    )
    
    conn.commit()
    conn.close()
    
    return redirect("/dashboard")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

if __name__ == '__main__':
    app.run(debug=True)