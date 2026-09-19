import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SVMS Mobile',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List vendors = [];
  List notifications = [];

  Future<void> fetchVendors() async {
    final res = await http.get(
      Uri.parse('http://103.175.219.57:8001/api/vendors'),
      headers: {'Authorization': 'Bearer TOKEN'}
    );
    if (res.statusCode == 200) {
      setState(() {
        vendors = jsonDecode(res.body);
      });
    }
  }

  Future<void> fetchNotifications() async {
    final res = await http.get(
      Uri.parse('http://103.175.219.57:8001/api/mobile/notifications')
    );
    if (res.statusCode == 200) {
      setState(() {
        notifications = jsonDecode(res.body);
      });
    }
  }

  Future<void> verifyPayment(String traderId) async {
    final res = await http.get(
      Uri.parse('http://103.175.219.57:8001/api/market/verify/payment/$traderId')
    );
    final data = jsonDecode(res.body);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Status: ${data['status']}'),
        content: Text('Pedagang: ${data['trader']}\nTerakhir Bayar: ${data['last_payment']}'),
        actions: [TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK'))],
      )
    );
  }

  Future<void> uploadReport(String path) async {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://103.175.219.57:8000/api/reports'),
    );
    request.files.add(await http.MultipartFile.fromPath('photo', path));
    await request.send();
  }

  Future<void> getGPS() async {
    Position position = await Geolocator.getCurrentPosition();
    print(position);
  }

  @override
  void initState() {
    super.initState();
    fetchVendors();
    fetchNotifications();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SVMS Mobile – Guard Edition')),
      body: Column(
        children: [
          if (notifications.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.red.shade100,
              child: Text(
                '🚨 ${notifications.length} Laporan Pungli Baru!',
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
              ),
            ),
          Expanded(
            child: ListView.builder(
              itemCount: vendors.length,
              itemBuilder: (context, index) {
                final v = vendors[index];
                return ListTile(
                  title: Text(v['name']),
                  subtitle: Text('Slot: ${v['slot_code'] ?? '-'} | Rep: ${v['reputation_score'] ?? 0}'),
                  trailing: ElevatedButton(
                    onPressed: () => verifyPayment(v['id']),
                    child: const Text('VERIFY', style: TextStyle(fontSize: 10)),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: getGPS,
        child: const Icon(Icons.location_on),
      ),
    );
  }
}
