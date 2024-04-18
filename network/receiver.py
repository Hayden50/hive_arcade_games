# This file blocks, waiting for the sender message.

import socket
import requests

# Set up the UDP socket
UDP_IP = "0.0.0.0"  # Listen on all available network interfaces
UDP_PORT = 5005

# Create a UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Bind the socket to the port
sock.bind((UDP_IP, UDP_PORT))

print("Listening for broadcast messages...")

try:
    # Receive broadcast messages
    while True:
        data, addr = sock.recvfrom(1024)  # Buffer size is 1024 bytes
        payload = {'Game': data.decode()}
        r = requests.post('http://localhost:5000/findNodes', json=payload)
        #print(r.text)
        print("Received message:", data.decode())

finally:
    sock.close()
