import paramiko

HOST = "103.175.219.57"
USER = "root"
PASS = "M4ruw4h3@"

# Step 1: Read current file to confirm content
# Step 2: Apply the two patches via sed inside the container
# Step 3: Rebuild and restart

commands = [
    # Verify current state - check for the bad import
    "docker exec svms-frontend-1 grep -n 'useAuth' /app/src/app/admin/siptu/page.jsx",

    # Patch 1: Remove the useAuth import line
    """docker exec svms-frontend-1 sed -i '/import { useAuth } from "@\\/utils\\/auth";/d' /app/src/app/admin/siptu/page.jsx""",

    # Patch 2: Replace the useAuth + loading logic with role-based check
    # We need to replace 3 lines:
    #   const { user, loading, isAdmin } = useAuth();
    #   \n
    #   if (loading) return null;
    # With:
    #   const isAdmin = role === "admin";
    #   \n
    r"""docker exec svms-frontend-1 sed -i 's/const { user, loading, isAdmin } = useAuth();/const isAdmin = role === "admin";/' /app/src/app/admin/siptu/page.jsx""",

    # Remove the "if (loading) return null;" line  
    r"""docker exec svms-frontend-1 sed -i '/if (loading) return null;/d' /app/src/app/admin/siptu/page.jsx""",

    # Verify patches applied
    "docker exec svms-frontend-1 grep -n 'useAuth\\|isAdmin\\|loading' /app/src/app/admin/siptu/page.jsx",

    # Rebuild inside the container
    "docker exec svms-frontend-1 sh -c 'cd /app && npm run build' 2>&1 | tail -20",

    # Restart the frontend container to pick up new build
    "docker restart svms-frontend-1 2>&1",
]

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASS, timeout=15)
print("Connected!\n")

for cmd in commands:
    print(f">>> {cmd[:100]}...")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=180)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err:
        print(f"STDERR: {err}")
    print("---")

client.close()
print("\nDeploy complete!")
