import subprocess

def run_build():
    with open("build_local_4_utf8.log", "w", encoding="utf-8") as f:
        process = subprocess.run(
            ["npm", "run", "build"],
            cwd=r"d:\MP\apps\web",
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        f.write(process.stdout)
        print("Exit code:", process.returncode)

if __name__ == "__main__":
    run_build()
