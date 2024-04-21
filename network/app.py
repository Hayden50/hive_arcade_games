from flask import Flask, render_template, request
from flask.json import jsonify
from flask_cors import CORS
import socket
import time
import os

app = Flask(__name__, static_url_path="")
CORS(app)

#Maybe make this into dictionary with gameID as key, value has metadata of the game, user proposing, game type etc.
gamesList = []

#This route handles both the python receiver and the frontend api calls
#The post method comes from the python receiver and anytime it receives a game broadcast, adds it to the gamesList
#The get method comes from the frontend and anytime a user hits the refresh button on the frontend, it returns the gamesList
@app.route("/findNodes", methods=['POST', 'GET'])
def findNodes():
    #Code coming from the python receiver, puts other game nodes into list
    if request.method == 'POST':
        data = request.get_json()
        print(data['Game'])
        gamesList.append(data['Game'])
        return{}
    #Checks other games that currently exist
    if request.method == 'GET':
        return {'Data':gamesList}

#This route is for handling a user accepting a game, and thus that game must be taken out of the gamesList
@app.route("/acceptGame", methods=['POST'])


#This route is for when a user on the frontend creates a game
#This game will be broadcast to all other nodes on the network currently
@app.route("/broadcast", methods=['POST'])
def broadcast():
    # Set up the UDP socket
    UDP_IP = "255.255.255.255"  # Broadcasting IP address
    UDP_PORT = 5005
    #MESSAGE = "Hello, nodes!"

    # Create a UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # Enable broadcasting mode
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

    gameInfo = request.get_json()
    gameType = gameInfo['GameType']
    userInfo = str(gameInfo['User'])
    gameRequestMessage = gameType + " game request by:" + userInfo

    try:
        # Send the broadcast message
        sock.sendto(gameRequestMessage.encode(), (UDP_IP, UDP_PORT))
        sock.sendto(gameRequestMessage.encode(), (UDP_IP, 5006))
        print(gameRequestMessage)

    finally:
        # Close the socket
        sock.close()
        return {'data': gameInfo}

@app.route("/getUserData", methods=['GET'])
def check_trophy():
    username_file_path = "./network/username.txt"
    trophy_file_path = "./network/trophy.txt"

    trophies = "0"
    uname = ""

    if os.path.exists(username_file_path):
        with open(username_file_path, 'r') as file:
            uname = file.read().strip()

    if os.path.exists(trophy_file_path):
        with open(trophy_file_path, 'r') as file:
            trophies = file.read().strip()
    else:
        # Creates a new file with 0 trophies
        with open(trophy_file_path, 'w') as file:
            file.write('0')

    res = {'trophies': trophies, 'username': uname}
    return jsonify(res)

@app.route("/createUsername", methods=['POST'])
def create_username():
    username_file_path = "./network/username.txt"
    data = request.get_json()
    with open(username_file_path, 'w') as file:
        file.write(data['username'])

    return data

if __name__ == "__main__":
    app.run(debug=True)
