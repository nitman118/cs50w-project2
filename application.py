import os

from flask import Flask,render_template,request, jsonify, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

users=[] # users logged in
rooms=set()

class ChatRoom:
    roomName=''
    history=[]

    def __init__(self,roomName):
        self.roomName=roomName
        self.history=[] #initialize to make it an instance variable

    def addMsg(self, msg, userid):
        self.history.append(userid+":"+msg)
        print(f"added message {msg} to {self.roomName}")
    

@app.route("/")
def login():
    return render_template('login.html')

# @app.route("/index", methods=["GET","POST"])
# def index():
#     if request.method=="POST":
#         return redirect(url_for('test'))
#     else:
#         return "FALSE"

@app.route('/chatLobby', methods=["GET","POST"])
def chatLobby():
    if request.method=="POST":
        dname=request.form.get('dname')
        return render_template('rooms.html', dname=dname)
    elif request.method=="GET":
        return


@app.route('/checkName', methods=["POST"])
def checkName():
    dname=request.form.get('name')
    if dname in users:
        return jsonify({'success':False})
    else:
        users.append(dname)
        return jsonify({'success':True})
    return 


@socketio.on('createRoom')
def createRoom(data):
    rname=data['rname']
    roomnames=[room.roomName for room in rooms]
    if rname in roomnames:
        emit("roomresponse",{"success":False})
    else:
        room = ChatRoom(roomName=rname)
        rooms.add(room)
        emit("roomresponse",{"success":True,"rname":rname},broadcast=True)
    

@socketio.on('join')
def join(data):
    test()
    username = data['user_id']
    room = data['rname']
    print(f"input room:{room}")
    join_room(room)
    for r in rooms:
        print(f" room name:{r.roomName}")
        if r.roomName==room:
            print(f'executed at{r.roomName}')
            print(r.history)
            emit('room_details',r.history) 

    

@socketio.on('leave')
def leave(data):
    username = data['user_id']
    room = data['rname']
    leave_room(room)
    emit(username + ' has left the room.', room=room)

@socketio.on('message')
def message(data):
    room=data['rname']
    for r in rooms:
        if r.roomName==room:
            r.addMsg(msg=data['msg'],userid=data['user_id'])
    emit('message', {'msg':data['user_id']+":"+data['msg']},room=room)

def test():
    for ro in rooms:
        print(f"room name {ro.roomName}")
        print(f"room history {ro.history}")

@app.route('/getRooms', methods=['POST'])
def getRooms():
    roomNames=[r.roomName for r in rooms]
    print("response from getrooms:",jsonify(roomNames))
    return jsonify(roomNames)

#This line of code is added since flask run is not supported by flask_socketio
if __name__=="__main__":
    socketio.run(app)

