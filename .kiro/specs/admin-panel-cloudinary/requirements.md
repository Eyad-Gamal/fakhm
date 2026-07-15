# Requirements Document

## Introduction

This document specifies the requirements for building a complete Admin Panel with Cloudinary integration for the Fakhem Perfumes website. The system will provide comprehensive content management capabilities including products, categories, services, and site settings, while utilizing Cloudinary for efficient cloud-based image hosting and management.

## Glossary

- **Admin_Panel**: The web-based administrative interface for managing website content
- **Cloudinary_Service**: The cloud-based image and media management service
- **Image_Upload_Handler**: The component responsible for uploading images to Cloudinary
- **Content_Manager**: The component managing products, categories, and services
- **Settings_Manager**: The component managing site-wide configuration
- **MongoDB_Database**: The MongoDB Atlas database storing application data
- **Image_URL**: The HTTPS link to an image hosted on Cloudinary servers
- **Public_ID**: The unique identifier assigned by Cloudinary to each uploaded image
- **Hero_Section**: The main landing page banner section with dynamic content
- **Logo_Component**: The site branding image displayed in the header
- **Environment_Variables**: Secure configuration values stored in .env file
- **Base64_Encoding**: The current image storage method converting images to text format
- **Image_Metadata**: Information about an image including URL, public ID, and dimensions

## Requirements

### Requirement 1: Cloudinary Integration

**User Story:** As a system administrator, I want to integrate Cloudinary for image hosting, so that images are stored efficiently on cloud servers instead of in the database.

#### Acceptance Criteria

1. THE Admin_Panel SHALL use the Cloudinary Node.js SDK to upload images
2. WHEN an image is uploaded, THE Image_Upload_Handler SHALL send the image file to Cloudinary servers
3. WHEN Cloudinary successfully stores an image, THE Image_Upload_Handler SHALL receive an Image_URL and Public_ID
4. THE Admin_Panel SHALL store only the Image_URL or Public_ID in MongoDB_Database
5. THE Admin_Panel SHALL NOT store Base64_Encoding or binary image data in MongoDB_Database
6. FOR ALL uploaded images, the Image_URL SHALL use HTTPS protocol
7. WHEN an image upload fails, THE Image_Upload_Handler SHALL return a descriptive error message to the user

### Requirement 2: Secure Credential Management

**User Story:** As a developer, I want Cloudinary credentials stored securely, so that API secrets are not exposed in the codebase.

#### Acceptance Criteria

1. THE Admin_Panel SHALL read Cloudinary credentials from Environment_Variables
2. THE Environment_Variables file SHALL contain CLOUDINARY_CLOUD_NAME with value "wwv1h4ll"
3. THE Environment_Variables file SHALL contain CLOUDINARY_API_KEY with value "863961136996957"
4. THE Environment_Variables file SHALL contain CLOUDINARY_API_SECRET with value "k_0NOQKo6TO-jxix9kDo0mK_5z4"
5. THE Admin_Panel SHALL NOT hard-code API credentials in source files
6. THE .gitignore file SHALL include .env to prevent credential exposure
7. WHEN Environment_Variables are missing, THE Admin_Panel SHALL fail startup with a descriptive error message

### Requirement 3: Product Management

**User Story:** As an admin user, I want to manage products through the admin panel, so that I can control the product catalog displayed on the website.

#### Acceptance Criteria

1. WHEN the admin accesses the products section, THE Admin_Panel SHALL display all products sorted by order field
2. THE Admin_Panel SHALL allow creating a new product with name, category, badge, images, sizes, and prices
3. THE Admin_Panel SHALL allow editing existing product details
4. THE Admin_Panel SHALL allow deleting a product
5. THE Admin_Panel SHALL allow reordering products via drag-and-drop interface
6. WHEN a product is created or updated with images, THE Image_Upload_Handler SHALL upload images to Cloudinary_Service
7. THE Admin_Panel SHALL store Image_URL references in the product document
8. WHEN a product image is deleted, THE Admin_Panel SHALL remove the image from Cloudinary_Service
9. THE Admin_Panel SHALL validate that product name is not empty before saving
10. THE Admin_Panel SHALL support multiple images per product with overlay configuration

### Requirement 4: Category Management

**User Story:** As an admin user, I want to manage product categories, so that products can be organized and filtered effectively.

#### Acceptance Criteria

1. WHEN the admin accesses the categories section, THE Admin_Panel SHALL display all categories sorted by order field
2. THE Admin_Panel SHALL allow creating a new category with a name
3. THE Admin_Panel SHALL allow editing category names
4. THE Admin_Panel SHALL allow deleting a category
5. THE Admin_Panel SHALL allow reordering categories via drag-and-drop interface
6. THE Admin_Panel SHALL validate that category name is not empty before saving
7. WHEN a category is deleted, THE Admin_Panel SHALL update or warn about affected products

### Requirement 5: Service Management

**User Story:** As an admin user, I want to manage services offered, so that the services section displays current offerings.

#### Acceptance Criteria

1. WHEN the admin accesses the services section, THE Admin_Panel SHALL display all services sorted by order field
2. THE Admin_Panel SHALL allow creating a service with name, description, icon, and images
3. THE Admin_Panel SHALL allow editing service details
4. THE Admin_Panel SHALL allow deleting a service
5. THE Admin_Panel SHALL allow reordering services via drag-and-drop interface
6. WHEN service images are uploaded, THE Image_Upload_Handler SHALL upload them to Cloudinary_Service
7. THE Admin_Panel SHALL store Image_URL references in the service document
8. THE Admin_Panel SHALL validate that service name and description are not empty before saving

### Requirement 6: Hero Section Management

**User Story:** As an admin user, I want to manage the hero section content, so that the landing page displays updated marketing content.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide an interface to edit Hero_Section content
2. THE Admin_Panel SHALL allow updating hero title text
3. THE Admin_Panel SHALL allow updating hero subtitle text
4. THE Admin_Panel SHALL allow updating hero badge text
5. THE Admin_Panel SHALL allow updating call-to-action button text
6. THE Admin_Panel SHALL allow uploading circle images for hero background
7. WHEN hero images are uploaded, THE Image_Upload_Handler SHALL upload them to Cloudinary_Service
8. THE Admin_Panel SHALL store Image_URL references in the hero document
9. WHEN hero content is saved, THE Admin_Panel SHALL persist changes to MongoDB_Database

### Requirement 7: Logo Management

**User Story:** As an admin user, I want to manage the site logo, so that branding can be updated without code changes.

#### Acceptance Criteria

1. THE Settings_Manager SHALL provide an interface to upload a new logo image
2. WHEN a logo is uploaded, THE Image_Upload_Handler SHALL upload it to Cloudinary_Service
3. THE Settings_Manager SHALL store the logo Image_URL in MongoDB_Database
4. WHEN the logo is changed, THE Logo_Component SHALL display the updated image
5. THE Admin_Panel SHALL support common image formats including PNG, JPEG, SVG, and WebP
6. THE Admin_Panel SHALL validate that uploaded logo files do not exceed 5MB in size

### Requirement 8: Settings Management

**User Story:** As an admin user, I want to manage site-wide settings, so that contact information and footer content can be updated easily.

#### Acceptance Criteria

1. THE Settings_Manager SHALL provide an interface to edit WhatsApp contact number
2. THE Settings_Manager SHALL provide an interface to edit Instagram profile URL
3. THE Settings_Manager SHALL provide an interface to edit Facebook page URL
4. THE Settings_Manager SHALL provide an interface to edit footer text
5. THE Settings_Manager SHALL provide an interface to edit copyright text
6. THE Settings_Manager SHALL provide an interface to set premium product price threshold
7. WHEN settings are saved, THE Settings_Manager SHALL validate URL formats for social media links
8. WHEN settings are saved, THE Settings_Manager SHALL persist changes to MongoDB_Database

### Requirement 9: Image Upload API Replacement

**User Story:** As a developer, I want to replace the Base64 image upload with Cloudinary upload, so that the system uses cloud storage instead of database storage.

#### Acceptance Criteria

1. THE Image_Upload_Handler SHALL replace the existing multer memory storage implementation
2. THE Image_Upload_Handler SHALL accept multipart form data with image files
3. WHEN receiving an upload request, THE Image_Upload_Handler SHALL upload files to Cloudinary_Service using the Node.js SDK
4. WHEN upload succeeds, THE Image_Upload_Handler SHALL return an array of Image_URL and Public_ID pairs
5. THE Image_Upload_Handler SHALL support uploading up to 10 images in a single request
6. THE Image_Upload_Handler SHALL support JPEG, PNG, WebP, and GIF image formats
7. WHEN upload fails, THE Image_Upload_Handler SHALL return HTTP 500 status with error details
8. THE Image_Upload_Handler SHALL set appropriate Cloudinary upload options including folder organization and transformations

### Requirement 10: Admin Panel Performance

**User Story:** As an admin user, I want the admin panel to perform efficiently, so that content management tasks are completed quickly.

#### Acceptance Criteria

1. WHEN loading the products list, THE Admin_Panel SHALL display results within 2 seconds
2. WHEN loading the categories list, THE Admin_Panel SHALL display results within 1 second
3. WHEN loading the services list, THE Admin_Panel SHALL display results within 2 seconds
4. WHEN uploading an image, THE Admin_Panel SHALL show upload progress indicator
5. WHEN an image upload takes longer than 5 seconds, THE Admin_Panel SHALL display a timeout warning
6. THE Admin_Panel SHALL implement client-side form validation to reduce failed server requests
7. THE Admin_Panel SHALL use optimistic UI updates for better perceived performance

### Requirement 11: Error Handling and User Feedback

**User Story:** As an admin user, I want clear error messages and feedback, so that I understand what actions succeeded or failed.

#### Acceptance Criteria

1. WHEN an API request fails, THE Admin_Panel SHALL display a user-friendly error message
2. WHEN an image upload fails, THE Admin_Panel SHALL display the specific failure reason
3. WHEN a form submission succeeds, THE Admin_Panel SHALL display a success confirmation message
4. WHEN a delete operation is initiated, THE Admin_Panel SHALL display a confirmation dialog
5. WHEN validation fails, THE Admin_Panel SHALL highlight invalid fields with error messages
6. THE Admin_Panel SHALL display loading indicators during asynchronous operations
7. WHEN network connectivity is lost, THE Admin_Panel SHALL notify the user

### Requirement 12: Data Migration and Backward Compatibility

**User Story:** As a developer, I want existing Base64 images to remain functional, so that the migration to Cloudinary does not break existing content.

#### Acceptance Criteria

1. THE Content_Manager SHALL continue to display existing Base64_Encoding images
2. WHEN editing a product with Base64_Encoding images, THE Admin_Panel SHALL allow replacing them with Cloudinary images
3. THE Admin_Panel SHALL detect whether an image uses Base64_Encoding or Cloudinary Image_URL format
4. THE Admin_Panel SHALL provide a migration tool to convert Base64_Encoding images to Cloudinary
5. WHEN displaying images, THE Admin_Panel SHALL support both Base64_Encoding and Image_URL formats during the transition period
6. THE server SHALL maintain the /uploads static file route for backward compatibility

## Dependencies

- Node.js v14 or higher
- Express.js web framework
- MongoDB Atlas database connection
- Cloudinary Node.js SDK
- Multer for handling multipart form data
- Existing admin.html file in public/ directory

## Success Criteria

The implementation will be considered successful when:

1. All images are uploaded to Cloudinary instead of being stored as Base64 in MongoDB
2. The admin panel provides full CRUD operations for products, categories, and services
3. Hero section and logo can be updated through the admin interface
4. All Cloudinary credentials are stored in environment variables and excluded from git
5. The admin panel maintains the same performance level as the previous implementation
6. Existing Base64 images continue to function during the migration period
