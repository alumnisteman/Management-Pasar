import paramiko
import base64
import os

def deploy_billing_engine(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        files = [
            ("app/Models/Bill.php", "/var/www/svms/backend/app/Models/Bill.php"),
            ("app/Services/BillingService.php", "/var/www/svms/backend/app/Services/BillingService.php"),
            ("app/Console/Commands/GenerateMonthlyBills.php", "/var/www/svms/backend/app/Console/Commands/GenerateMonthlyBills.php")
        ]
        
        for local, remote in files:
            print(f"Deploying {local}...")
            # Ensure directory exists
            remote_dir = os.path.dirname(remote)
            client.exec_command(f"mkdir -p {remote_dir}")
            
            with open(local, 'rb') as f:
                content = f.read()
                encoded = base64.b64encode(content).decode('utf-8')
            
            client.exec_command(f"echo '{encoded}' | base64 -d > {remote}")
            
        print("Registering command in Kernel (if needed)...")
        # In Laravel 11, it auto-discovers commands in app/Console/Commands.
        
        print("Billing Engine deployed successfully.")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_billing_engine("103.175.219.57", "root", "M4ruw4h3@")
