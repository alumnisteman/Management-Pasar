.PHONY: install start stop restart healthcheck update uninstall

# Instalasi satu perintah
install:
	@echo "Menjalankan instalasi..."
	./scripts/install.sh

# Menjalankan semua layanan
start:
	@echo "Menyalakan layanan..."
	./scripts/start.sh

# Mematikan semua layanan
stop:
	@echo "Mematikan layanan..."
	./scripts/stop.sh

# Restart layanan
restart:
	@echo "Mere-start layanan..."
	./scripts/restart.sh

# Healthcheck seluruh stack
healthcheck:
	@echo "Memeriksa kesehatan layanan..."
	./scripts/healthcheck.sh

# Memperbarui aplikasi
update:
	@echo "Memperbarui aplikasi..."
	./scripts/update.sh

# Uninstall seluruh aplikasi & data
uninstall:
	@echo "Meng-uninstall aplikasi..."
	./scripts/uninstall.sh
