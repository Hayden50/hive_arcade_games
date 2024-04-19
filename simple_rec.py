import socket

def receive_broadcast_messages(port):
    # Create a UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # Bind the socket to the port
    sock.bind(('0.0.0.0', port))  # Listen on all available network interfaces

    print("Listening for broadcast messages on port", port)

    try:
        # Receive broadcast messages
        while True:
            data, addr = sock.recvfrom(1024)  # Buffer size is 1024 bytes
            print("Received message:", data.decode(), "from", addr)

    finally:
        # Close the socket
        sock.close()

# Example port to listen on
port = 5005  # Example port

# Listen for broadcast messages on the specified port
receive_broadcast_messages(port)
