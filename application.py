import os

from flask import Flask,render_template,request, jsonify, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# # Ensure templates are auto-reloaded
# app.config["TEMPLATES_AUTO_RELOAD"] = True

# @app.after_request
# def after_request(response):
#     response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
#     response.headers["Expires"] = 0
#     response.headers["Pragma"] = "no-cache"
#     return response

users=[] # users logged in

class ChatRoom:
    roomName=''
    history={}

    def __init__(self,roomName):
        self.roomName=roomName
    



@app.route("/")
def login():
    return render_template('login.html')

# @app.route("/index", methods=["GET","POST"])
# def index():
#     if request.method=="POST":
#         return redirect(url_for('test'))
#     else:
#         return "FALSE"

@app.route('/chatLobby', methods=["POST"])
def chatLobby():
    dname=request.form.get('dname')
    return render_template('rooms.html', dname=dname)

@app.route('/checkName', methods=["POST"])
def checkName():
    dname=request.form.get('name')
    if dname in users:
        return jsonify({'success':False})
    else:
        users.append(dname)
        return jsonify({'success':True})






#This line of code is added since flask run is not supported by flask_socketio
if __name__=="__main__":
    socketio.run(app)

