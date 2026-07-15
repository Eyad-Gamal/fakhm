# Cloudinary Service Module

## Overview

The CloudinaryService module provides a clean interface for interacting with Cloudinary cloud storage for image management. This service encapsulates all Cloudinary SDK operations and provides error handling, validation, and utility methods for working with Cloudinary URLs and Base64 images.

## Features

- ✅ Single and batch image uploads to Cloudinary
- ✅ Single and batch image deletions from Cloudinary
- ✅ Public ID extraction from Cloudinary URLs
- ✅ URL format validation (Cloudinary vs Base64)
- ✅ Comprehensive error handling
- ✅ Environment-based configuration
- ✅ HTTPS-only image URLs

## Installation

The Cloudinary SDK is already installed as a dependency:

```bash
npm install cloudinary
```

## Configuration

Set the following environment variables in your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The service will throw an error on initialization if any required environment variables are missing.

## Usage

### Import the Service

```javascript
const CloudinaryService = require('./api/services/cloudinary.service');
```

### Upload a Single Image

```javascript
const imageBuffer = req.file.buffer; // From multer

try {
  const result = await CloudinaryService.uploadImage(imageBuffer, {
    folder: 'products',
    transformation: {
      width: 800,
      height: 800,
      crop: 'fill'
    }
  });
  
  console.log('Image URL:', result.url);
  console.log('Public ID:', result.publicId);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

### Upload Multiple Images

```javascript
const imageBuffers = req.files.map(file => file.buffer);

try {
  const results = await CloudinaryService.uploadImages(imageBuffers, {
    folder: 'products'
  });
  
  results.forEach((result, index) => {
    console.log(`Image ${index + 1} URL:`, result.url);
  });
} catch (error) {
  console.error('Batch upload failed:', error.message);
}
```

### Delete an Image

```javascript
const publicId = 'products/image123';

try {
  const result = await CloudinaryService.deleteImage(publicId);
  
  if (result.result === 'ok') {
    console.log('Image deleted successfully');
  } else {
    console.log('Image not found');
  }
} catch (error) {
  console.error('Deletion failed:', error.message);
}
```

### Delete Multiple Images

```javascript
const publicIds = ['products/image1', 'products/image2', 'products/image3'];

try {
  const results = await CloudinaryService.deleteImages(publicIds);
  
  results.forEach((result, index) => {
    console.log(`Image ${index + 1}:`, result.result);
  });
} catch (error) {
  console.error('Batch deletion failed:', error.message);
}
```

### Extract Public ID from URL

```javascript
const url = 'https://res.cloudinary.com/demo/image/upload/v1234567890/products/image.jpg';
const publicId = CloudinaryService.extractPublicId(url);

console.log('Public ID:', publicId); // Output: products/image
```

### Check URL Format

```javascript
// Check if URL is from Cloudinary
const isCloudinary = CloudinaryService.isCloudinaryUrl(
  'https://res.cloudinary.com/demo/image/upload/v123/test.jpg'
);
console.log('Is Cloudinary URL:', isCloudinary); // Output: true

// Check if string is Base64 image
const isBase64 = CloudinaryService.isBase64Image(
  'data:image/png;base64,iVBORw0KGgo...'
);
console.log('Is Base64 image:', isBase64); // Output: true
```

## API Reference

### `uploadImage(fileBuffer, options)`

Uploads a single image to Cloudinary.

**Parameters:**
- `fileBuffer` (Buffer): Image file buffer
- `options` (Object): Upload options
  - `folder` (string): Cloudinary folder path (default: 'fakhem')
  - `transformation` (Object): Image transformation options
  - Any other Cloudinary upload options

**Returns:** `Promise<{url: string, publicId: string}>`

**Throws:** Error with descriptive message on failure

---

### `uploadImages(fileBuffers, options)`

Uploads multiple images to Cloudinary in parallel.

**Parameters:**
- `fileBuffers` (Array<Buffer>): Array of image file buffers
- `options` (Object): Upload options (same as uploadImage)

**Returns:** `Promise<Array<{url: string, publicId: string}>>`

**Throws:** Error with descriptive message on failure

---

### `deleteImage(publicId)`

Deletes a single image from Cloudinary.

**Parameters:**
- `publicId` (string): Cloudinary public ID

**Returns:** `Promise<{result: string}>` - 'ok' if successful, 'not found' if image doesn't exist

**Throws:** Error if publicId is null/empty or on API failure

---

### `deleteImages(publicIds)`

Deletes multiple images from Cloudinary in parallel.

**Parameters:**
- `publicIds` (Array<string>): Array of Cloudinary public IDs

**Returns:** `Promise<Array<{result: string}>>`

**Throws:** Error with descriptive message on failure

---

### `extractPublicId(url)`

Extracts the public ID from a Cloudinary URL.

**Parameters:**
- `url` (string): Cloudinary image URL

**Returns:** `string|null` - Public ID or null if not a valid Cloudinary URL

**Example:**
```javascript
extractPublicId('https://res.cloudinary.com/demo/image/upload/v123/folder/test.jpg')
// Returns: 'folder/test'
```

---

### `isCloudinaryUrl(str)`

Checks if a string is a Cloudinary URL.

**Parameters:**
- `str` (string): String to check

**Returns:** `boolean` - true if string starts with 'https://res.cloudinary.com/'

---

### `isBase64Image(str)`

Checks if a string is a Base64 encoded image.

**Parameters:**
- `str` (string): String to check

**Returns:** `boolean` - true if string starts with 'data:image/'

## Error Handling

The service provides comprehensive error handling with descriptive messages:

### Authentication Errors (HTTP 401)
```
Cloudinary authentication failed. Check credentials.
```

### Invalid Request Errors (HTTP 400)
```
Invalid upload request: [error details]
```

### Timeout Errors
```
Upload timeout. Please try again.
```

### Generic Upload Errors
```
Upload failed: [error details]
```

### Deletion Errors
```
Public ID is required for deletion
Image deletion failed: [error details]
```

### Batch Operation Errors
```
Batch upload failed: [error details]
Batch deletion failed: [error details]
```

## Testing

### Unit Tests

Run unit tests to verify the service methods:

```bash
npm test -- cloudinary-service.test.js
```

### Integration Tests

Run integration tests to verify actual Cloudinary API interaction:

```bash
RUN_INTEGRATION_TESTS=true npm test -- cloudinary-integration.test.js
```

**Note:** Integration tests require valid Cloudinary credentials and will upload/delete test images.

## Best Practices

1. **Always handle errors**: Wrap service calls in try-catch blocks
2. **Use folders**: Organize images in Cloudinary folders for better management
3. **Clean up**: Delete images when no longer needed to save storage
4. **Validate inputs**: Check file types and sizes before uploading
5. **Use transformations**: Apply transformations during upload for better performance
6. **Store public IDs**: Save public IDs in your database for easy deletion

## Requirements Satisfied

This module satisfies the following requirements from the specification:

- **Requirement 1.1, 1.2, 1.3**: Cloudinary Integration
- **Requirement 2.2, 2.3, 2.4**: Secure Credential Management
- **Requirement 9.1, 9.3**: Image Upload API Replacement
- **Requirement 12.3**: Data Migration and Backward Compatibility

## Related Files

- Implementation: `api/services/cloudinary.service.js`
- Unit Tests: `test/unit/cloudinary-service.test.js`
- Integration Tests: `test/integration/cloudinary-integration.test.js`
- Configuration: `.env` (not in git)

## License

This module is part of the Fakhem Perfumes project.
