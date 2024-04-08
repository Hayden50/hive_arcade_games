# This file will be changed or deleted, but is being used to show
# how the broadcast function works

import socket

# Set up the UDP socket
UDP_IP = "255.255.255.255"  # Broadcasting IP address
UDP_PORT = 5005
MESSAGE = "Hello, nodes!"

# Create a UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Enable broadcasting mode
sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

try:
    # Send the broadcast message
    sock.sendto(MESSAGE.encode(), (UDP_IP, UDP_PORT))
    sock.sendto(MESSAGE.encode(), (UDP_IP, 5006))
    print("Broadcast message sent:", MESSAGE)

finally:
    # Close the socket
    sock.close()
