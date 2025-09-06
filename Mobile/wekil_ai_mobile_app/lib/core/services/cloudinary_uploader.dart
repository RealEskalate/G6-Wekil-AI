import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

class CloudinaryUploadResponse {
  final String secureUrl;
  final String publicId;
  final String? originalFilename;
  final int? width;
  final int? height;
  final String? format;
  final int? bytes;

  CloudinaryUploadResponse({
    required this.secureUrl,
    required this.publicId,
    this.originalFilename,
    this.width,
    this.height,
    this.format,
    this.bytes,
  });

  factory CloudinaryUploadResponse.fromJson(Map<String, dynamic> json) {
    return CloudinaryUploadResponse(
      secureUrl: json['secure_url'] as String? ?? json['url'] as String? ?? '',
      publicId: json['public_id'] as String? ?? '',
      originalFilename: json['original_filename'] as String?,
      width: json['width'] is int ? json['width'] as int : null,
      height: json['height'] is int ? json['height'] as int : null,
      format: json['format'] as String?,
      bytes: json['bytes'] is int ? json['bytes'] as int : null,
    );
  }
}

class CloudinaryUploader {
  final http.Client client;
  final String cloudName;
  final String uploadPreset;
  final String? defaultFolder;

  CloudinaryUploader({
    required this.client,
    required this.cloudName,
    required this.uploadPreset,
    this.defaultFolder,
  });

  Uri get _uploadUri => Uri.parse('https://api.cloudinary.com/v1_1/$cloudName/image/upload');

  Future<CloudinaryUploadResponse> uploadBytes(Uint8List bytes, {String? filename, String? folder}) async {
    final request = http.MultipartRequest('POST', _uploadUri);
    request.fields['upload_preset'] = uploadPreset;
    if ((folder ?? defaultFolder) != null && (folder ?? defaultFolder)!.isNotEmpty) {
      request.fields['folder'] = (folder ?? defaultFolder)!;
    }
    request.files.add(
      http.MultipartFile.fromBytes(
        'file',
        bytes,
        filename: filename ?? 'upload.jpg',
      ),
    );

    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);
    final raw = response.body;
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final decoded = json.decode(raw);
      if (decoded is Map<String, dynamic>) {
        final res = CloudinaryUploadResponse.fromJson(decoded);
        if (res.secureUrl.isEmpty) {
          throw Exception('Cloudinary response missing secure_url');
        }
        return res;
      }
      throw Exception('Unexpected Cloudinary response');
    }

    // Try to extract Cloudinary error message
    String message = 'Cloudinary upload failed (${response.statusCode})';
    try {
      final decoded = json.decode(raw);
      if (decoded is Map<String, dynamic>) {
        final err = decoded['error'];
        if (err is Map<String, dynamic>) {
          message = err['message'] as String? ?? message;
        } else {
          message = decoded['message'] as String? ?? message;
        }
      }
    } catch (_) {}
    throw Exception(message);
  }
}
