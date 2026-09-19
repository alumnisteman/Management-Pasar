import paramiko
import base64

def patch_vendor_controller(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)

        # Read current file
        stdin, stdout, _ = client.exec_command(
            "docker exec svms-app-1 cat /var/www/app/Http/Controllers/VendorController.php"
        )
        content = stdout.read().decode('utf-8', errors='replace')

        print("--- CURRENT validate blocks ---")
        for i, line in enumerate(content.splitlines()):
            if 'validate' in line or 'phone' in line or 'nik' in line or 'name' in line:
                print(f"  Line {i+1}: {line.rstrip()}")

        # Replace BOTH occurrences of the validate block that lack phone
        old_validate = """        $data = $request->validate([
            'name' => 'string|max:255',
            'nik' => 'string',
        ]);"""

        new_validate = """        $data = $request->validate([
            'name' => 'string|max:255|nullable',
            'nik' => 'string|nullable',
            'phone' => 'string|nullable',
        ]);"""

        if 'phone' in content:
            # Still fix the update block which may still be missing phone
            old_update = """        $data = $request->validate([
            'name' => 'string|max:255',
            'nik' => 'string|nullable',
        ]);"""
            new_update = """        $data = $request->validate([
            'name' => 'string|max:255|nullable',
            'nik' => 'string|nullable',
            'phone' => 'string|nullable',
        ]);"""
            patched = content.replace(old_update, new_update)
        else:
            patched = content.replace(old_validate, new_validate)

        if patched == content:
            print("Trying alternative patch strategy...")
            # Fallback: just inject phone after every 'nik' => line in validate blocks
            patched = content.replace(
                "'nik' => 'string',",
                "'nik' => 'string|nullable',\n            'phone' => 'string|nullable',"
            ).replace(
                "'nik' => 'string|nullable',",
                "'nik' => 'string|nullable',\n            'phone' => 'string|nullable',"
            )
            # Remove any duplicate phone lines
            import re
            patched = re.sub(r"('phone' => 'string\|nullable',\n\s+){2,}", "'phone' => 'string|nullable',\n", patched)

        # Write back to container
        encoded = base64.b64encode(patched.encode()).decode()
        cmd = f"echo '{encoded}' | base64 -d > /tmp/VendorController.php && docker cp /tmp/VendorController.php svms-app-1:/var/www/app/Http/Controllers/VendorController.php"
        stdin2, stdout2, stderr2 = client.exec_command(cmd)
        stdout2.channel.recv_exit_status()

        # Verify
        stdin3, stdout3, _ = client.exec_command(
            "docker exec svms-app-1 grep 'phone' /var/www/app/Http/Controllers/VendorController.php"
        )
        result = stdout3.read().decode().strip()
        print(f"\n--- RESULT: phone lines in VendorController ---\n{result}")

        # Clear Laravel cache
        stdin4, stdout4, _ = client.exec_command(
            "docker exec svms-app-1 php artisan config:clear && docker exec svms-app-1 php artisan route:clear"
        )
        stdout4.channel.recv_exit_status()
        print("Cache cleared.")

    except Exception as e:
        import traceback
        print(f"Error: {e}")
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    patch_vendor_controller("103.175.219.57", "root", "M4ruw4h3@")
