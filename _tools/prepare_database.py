import paramiko

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    sql_script = """
    USE svms;
    
    -- Drop empty tables so we can recreate them with indexes
    DROP TABLE IF EXISTS `order_items`;
    DROP TABLE IF EXISTS `orders`;
    DROP TABLE IF EXISTS `products`;
    DROP TABLE IF EXISTS `customers`;
    DROP TABLE IF EXISTS `purchase_order_items`;
    DROP TABLE IF EXISTS `purchase_orders`;
    DROP TABLE IF EXISTS `loyalty_points`;
    DROP TABLE IF EXISTS `emergency_reports`;
    DROP TABLE IF EXISTS `waste_logs`;

    -- Clean up migration records for these 5 tables so they can be re-migrated
    DELETE FROM migrations WHERE migration IN (
        '2026_05_20_100000_create_waste_logs_table',
        '2026_05_20_100001_create_ecommerce_tables',
        '2026_05_20_100002_create_b2b_supply_tables',
        '2026_05_20_100003_create_loyalty_tables',
        '2026_05_20_100004_create_emergency_reports_table'
    );

    -- Mark old pre-existing migrations as already run (batch 1)
    INSERT IGNORE INTO migrations (migration, batch) VALUES 
    ('2026_05_06_000000_create_svms_tables', 1),
    ('2026_05_06_100000_update_svms_structure', 1),
    ('2026_05_06_100001_create_vendors_table', 1),
    ('2026_05_06_200000_create_temporary_svms_tables', 1),
    ('2026_05_06_300000_add_grid_system_to_stalls', 1),
    ('2026_05_06_400000_create_smart_market_system', 1),
    ('2026_05_06_600000_create_billing_and_audit_system', 1),
    ('2026_05_06_700000_cleanup_deprecated_tables', 1),
    ('2026_05_06_800000_safety_audit_update', 1),
    ('2026_05_06_900000_enhanced_market_basics', 1),
    ('2026_05_06_999999_final_master_schema', 1),
    ('2026_05_07_000001_add_price_and_price_logs', 1),
    ('2026_05_10_000001_add_performance_indices', 1);
    """
    
    # Escape quotes and formatting for command line execution
    sql_script_escaped = sql_script.replace('"', '\\"').replace('`', '\\`').replace('$', '\\$')
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host}...")
        client.connect(host, username=user, password=password)
        
        # Run SQL query in the MySQL container
        command = f'docker exec -i svms-mysql-1 mysql -u root -proot -e "{sql_script_escaped}"'
        print("Executing remote DB prep command...")
        stdin, stdout, stderr = client.exec_command(command)
        
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        
        if out:
            print("Output:")
            print(out)
        if err:
            print("Error Output:")
            print(err)
            
        print("Database prepared successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    main()
