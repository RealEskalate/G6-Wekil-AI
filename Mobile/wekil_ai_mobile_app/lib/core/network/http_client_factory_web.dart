import 'package:http/http.dart' as http;
import 'package:http/browser_client.dart' as http_browser;

http.Client createBaseHttpClient() {
  final b = http_browser.BrowserClient()..withCredentials = true;
  return b;
}

// For web-only login workaround (no credentials => avoids CORS credentials rule).
http.Client createWebClientNoCreds() {
  // Default BrowserClient has withCredentials=false
  return http_browser.BrowserClient();
}
