import 'package:http/http.dart' as http;

http.Client createBaseHttpClient() => http.Client();

// IO has no credential mode concept; return a normal client.
http.Client createWebClientNoCreds() => http.Client();
