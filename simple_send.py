import socket
import struct

def get_local_ip():
    # Create a temporary socket
    temp_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Connect to an external server
        temp_sock.connect(("8.8.8.8", 80))
        # Get the local IP address
        local_ip = temp_sock.getsockname()[0]
    finally:
        # Close the temporary socket
        temp_sock.close()
    return local_ip

import socket

def get_subnet_mask():
    # Get the subnet mask using socket module
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.connect(("8.8.8.8", 80))  # Connect to a remote server (Google DNS)
        subnet_mask = s.getsockname()[1]
    return subnet_mask

def calculate_broadcast_address(ip_address, subnet_mask):
    # Convert IP address and subnet mask to integers
    ip_int = struct.unpack('!I', socket.inet_aton(ip_address))[0]
    subnet_mask_int = struct.unpack('!I', socket.inet_aton(subnet_mask))[0]

    # Calculate broadcast address
    broadcast_int = ip_int | (~subnet_mask_int & 0xFFFFFFFF)

    # Convert broadcast address back to string
    broadcast_address = socket.inet_ntoa(struct.pack('!I', broadcast_int))
    return broadcast_address

def send_broadcast_message(broadcast_address):
    message = 'HELLO'
    port = 5005

    # Create a UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # Set socket options to allow broadcasting
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

    try:
        # Send the broadcast message
        sock.sendto(message.encode(), (broadcast_address, port))
        print("Broadcast message sent:", message)

    finally:
        # Close the socket
        sock.close()


local_ip = get_local_ip()
subnet_mask = get_subnet_mask()
broadcast_address = calculate_broadcast_address(local_ip, str(subnet_mask))

print("Local IP address:", local_ip)
print("Subnet Mask:", subnet_mask)
print("Broadcast Address:", broadcast_address)

send_broadcast_message(broadcast_address)
