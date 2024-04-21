from flask import Flask, render_template, request
from flask_cors import CORS
import socket
import time

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
def acceptGame():
    if request.method == 'POST':
        gameData = request.get_json()
        encodedData = gameData['gameType']+":"+gameData['requestingUser']+":"+gameData['peerId']
        gamesList.remove(encodedData)
        #Now we need to tell all other servers to remove this data from their games list
        UDP_IP = "255.255.255.255"  # Broadcasting IP address
        UDP_PORT = 5005
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        try:
            # Send the broadcast message
            sock.sendto(("Remove -"+encodedData).encode(), ('<broadcast>', UDP_PORT))
            #sock.sendto(gameRequestMessage.encode(), (UDP_IP, UDP_PORT))
            #sock.sendto(gameRequestMessage.encode(), ('128.61.6.121', 5005))
            print(encodedData)

        finally:
        # Close the socket
            sock.close()
            return {'Data': encodedData}



#This route is for when a user on the frontend creates a game
#This game will be broadcast to all other nodes on the network currently
@app.route("/broadcast", methods=['POST'])
def broadcast():
    #Set up the UDP socket
    UDP_IP = "255.255.255.255"  # Broadcasting IP address
    UDP_PORT = 5005
    #MESSAGE = "Hello, nodes!"

    # Create a UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # hostname = socket.gethostname()
    # IP = socket.gethostbyname(hostname) 
    # sock.bind((IP, 5005))

    # Enable broadcasting mode
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)



    gameInfo = request.get_json()
    gameType = gameInfo['GameType']
    userInfo = str(gameInfo['User'])
    peerInfo = gameInfo['PeerId']
    gameRequestMessage = gameType + ":" + userInfo + ":" + peerInfo
    
    try:
        # Send the broadcast message
        sock.sendto(gameRequestMessage.encode(), ('<broadcast>', UDP_PORT))
        #sock.sendto(gameRequestMessage.encode(), (UDP_IP, UDP_PORT))
        #sock.sendto(gameRequestMessage.encode(), ('128.61.6.121', 5005))
        print(gameRequestMessage)

    finally:
        # Close the socket
        sock.close()
        return {'Data': gameInfo}


if __name__ == "__main__":
    app.run(debug=True)