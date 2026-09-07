import csv
import random
from datetime import datetime, timedelta

print("Generating 100,000 synthetic log records...")

actions = ['ALLOW', 'DENY', 'FLAGGED']
dest_ips = ['10.0.0.1', '10.0.0.2', '172.16.0.5']
protocols = ['HTTP', 'SSH', 'DNS', 'FTP']
now = datetime.now()

with open('security_logs.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['timestamp', 'source_ip', 'dest_ip', 'dest_port', 'action', 'bytes_sent', 'protocol'])
    
    for _ in range(100000):
        timestamp = (now - timedelta(seconds=random.randint(0, 86400))).strftime('%Y-%m-%d %H:%M:%S')
        source_ip = f"192.168.1.{random.randint(1, 254)}"
        dest_ip = random.choice(dest_ips)
        dest_port = random.randint(1, 65535)
        action = random.choice(actions)
        bytes_sent = random.randint(0, 5000)
        protocol = random.choice(protocols)
        
        writer.writerow([timestamp, source_ip, dest_ip, dest_port, action, bytes_sent, protocol])

print("Done! Created 'security_logs.csv' in your project folder.")
