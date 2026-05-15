# -*- coding: utf-8 -*-
"""
Tidy MP Root Directory
Memindahkan file yang berceceran di d:\MP ke folder yang sesuai.
"""
import os
import shutil
from pathlib import Path

ROOT = Path(r"d:\MP")

TOOLS_DIR = ROOT / "_tools"
LOGS_DIR  = ROOT / "_logs"
TEMP_DIR  = ROOT / "_temp"
HTML_DIR  = ROOT / "_html"

for d in [TOOLS_DIR, LOGS_DIR, TEMP_DIR, HTML_DIR]:
    d.mkdir(exist_ok=True)

PYTHON_SCRIPTS = [
    "backup_db.py", "build_dashboard_server.py", "build_dashboard_server_v2.py",
    "build_web_server.py", "build_web_server_v2.py", "build_web_server_v3.py",
    "check_build_log.py", "check_build_log_tail.py", "check_composer_autoload.py",
    "check_composer_json.py", "check_composer_start.py", "check_containers.py",
    "check_dashboard.py", "check_dashboard_container_ls.py",
    "check_dashboard_dockerfile.py", "check_dashboard_logs.py",
    "check_dashboard_logs_v2.py", "check_dupes.py", "check_duplicates.py",
    "check_indexes.py", "check_landing.py", "check_login_logs.py",
    "check_meili_env.py", "check_meilisearch.py", "check_networks.py",
    "check_nginx_ps.py", "check_schema.py", "check_server.py",
    "check_server_apps_ls.py", "check_server_apps_ls_final.py",
    "check_server_backend.py", "check_server_compose.py",
    "check_server_compose_ports.py", "check_server_dashboard.py",
    "check_server_dashboard_content.py", "check_server_dashboard_pkg.py",
    "check_server_dirs.py", "check_server_docker.py",
    "check_server_docker_compose_cmd.py", "check_server_docker_help.py",
    "check_server_docker_path.py", "check_server_docker_ps.py",
    "check_server_docker_ps_full.py", "check_server_env.py",
    "check_server_env_content.py", "check_server_git.py",
    "check_server_git_cmd.py", "check_server_main_nginx.py",
    "check_server_mobile.py", "check_server_mobile_v2.py",
    "check_server_nginx.py", "check_server_node.py",
    "check_server_node_modules.py", "check_server_pm2.py",
    "check_server_pm2_which.py", "check_server_ram.py",
    "check_server_resources.py", "check_server_status.py",
    "check_server_svms_ls.py", "check_server_volumes.py",
    "check_server_web_build.py", "check_server_web_ls.py",
    "check_server_webserver.py", "check_server_zip.py",
    "check_server_zip_web.py", "check_settings_table.py",
    "check_slot_data.py", "check_steman_dir.py", "check_steman_nginx.py",
    "check_steman_nginx_app.py", "check_steman_nginx_services.py",
    "check_steman_nginx_services_full.py", "check_structure.py",
    "check_svms.py", "check_tables.py", "check_web_build_success.py",
    "check_www.py", "clean_docker_images.py", "debug_pricelog.py",
    "deploy_apps.py", "deploy_dashboard.py", "deploy_elite.py",
    "deploy_features.py", "deploy_fix.py", "deploy_landing.py",
    "deploy_mobile.py", "deploy_schema.py", "deploy_seeder.py",
    "extract_apps_server.py", "find_auth_controllers.py",
    "fix_landing.py", "fix_migrations.py", "fix_server_structure.py",
    "fix_server_structure_v2.py", "fix_structure.py",
    "fix_wallets.py", "force_env_scout.py", "force_indexes.py",
    "force_scout_import.py", "get_trader.py", "head_steman_services.py",
    "install_and_build_server.py", "list_containers.py",
    "migrate_dashboard.py", "optimize_indexes.py", "reload_server_backend.py",
    "reset_db.py", "restore_db.py", "run_build_direct.py",
    "run_build_local.py", "run_doctor.py", "run_migration.py",
    "run_migration_safe.py", "scout_import.py", "seed_pricing.py",
    "setup_and_build_server.py", "setup_settings.py", "sftp_upload.py",
    "ssh_build.py", "ssh_run.py", "ssh_runner.py", "sync_models.py",
    "sync_server_backend.py", "sync_to_server.py", "sync_web_changes.py",
    "test_docker_compose.py", "test_login.py", "test_redis.py",
    "test_redis_raw.py", "tidy_mobile_server.py",
    "update_dashboard_dockerfile_v2.py", "update_env.py",
    "verify_meili.py", "verify_seeder.py",
]

SHELL_SCRIPTS = [
    "deploy.sh", "maintenance.sh", "seed.sh", "seed_pro_grid.sh",
    "seed_temp.sh", "fix_slots.sh",
]

LOG_FILES = [
    "build_local_4_utf8.log", "build_server.log", "build_server_run.log",
    "install_build.log", "migration_output.txt", "migration_stderr.txt",
    "migration_stdout.txt", "doctor_output.txt", "app_files.txt",
    "seeder_log.txt", "server_build.log", "setup_build.log",
]

HTML_FILES = [
    "admin_index.html", "dashboard_complete.html", "dashboard_secured.html",
    "dashboard_v55.html", "index.html", "landing.html",
]

TEMP_FILES = [
    "App.jsx", "MapView.jsx", "Stats.jsx", "api.js",
    "main.dart", "pubspec.yaml",
    "index.php", "test_redis.php",
    "Dockerfile.backend", "Dockerfile.dashboard", "Dockerfile_dashboard_simple",
    "apps.zip", "build.zip",
    "_ide_helper.php", "_ide_helper_models.php", "_ide_helpers_extra.php",
    "SMOS_SKILL.md",
    "Admin admin@svms.id  admin123.txt",
]

moved = []
skipped = []

def move_file(filename, target_dir):
    src = ROOT / filename
    dst = target_dir / filename
    if src.exists() and src.is_file():
        if dst.exists():
            skipped.append(f"  SKIP (exists): {filename}")
        else:
            shutil.move(str(src), str(dst))
            moved.append(f"  OK: {filename} -> {target_dir.name}/")
    else:
        skipped.append(f"  NOT FOUND: {filename}")

print("Merapikan direktori d:\\MP...\n")

print("[1] Python scripts -> _tools/")
for f in PYTHON_SCRIPTS:
    move_file(f, TOOLS_DIR)

print("[2] Shell scripts -> _tools/")
for f in SHELL_SCRIPTS:
    move_file(f, TOOLS_DIR)

print("[3] Log & output files -> _logs/")
for f in LOG_FILES:
    move_file(f, LOGS_DIR)

print("[4] HTML files -> _html/")
for f in HTML_FILES:
    move_file(f, HTML_DIR)

print("[5] Temp/misc files -> _temp/")
for f in TEMP_FILES:
    move_file(f, TEMP_DIR)

print("=" * 55)
print(f"Berhasil dipindah: {len(moved)} file")
for m in moved:
    print(m)

if skipped:
    print(f"\nDilewati ({len(skipped)}):")
    for s in skipped:
        print(s)

print("\n--- Sisa file di root d:\\MP ---")
remaining = [f for f in ROOT.iterdir() if f.is_file()]
for f in sorted(remaining):
    print(f"  {f.name}")
print(f"Total sisa: {len(remaining)} file")
print("Done!")
