# This file blocks, waiting for the sender message.

import socket
import requests
import struct


# Set up the UDP socket
UDP_IP = "0.0.0.0"  # Listen on all available network interfaces
UDP_PORT = 5008

# Create a UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)

# Bind the socket to the port
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)
sock.bind(('', UDP_PORT))


print("Listening for broadcast messages...")

try:
    # Receive broadcast messages
    while True:
        data, addr = sock.recvfrom(1024)  # Buffer size is 1024 bytes
        payload = {'Game': data.decode()}
        message = data.decode()
        print("Received message:", message)
        if(message.find("Remove -") != -1):
            messageArray = message.split('-')
            print(messageArray)
            payload = {'Game': messageArray[1]}
            #Need to remove this node from other flask servers that peers are running, still needs to be implemented
            r = requests.post('http://localhost:8000/removeNode', json=payload)
        else:
            r = requests.post('http://localhost:8000/findNodes', json=payload)
        #print(r.text)

finally:
    sock.close()
