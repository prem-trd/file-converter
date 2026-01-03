# Blueprint

## Overview

This project is a web-based utility application offering a comprehensive suite of tools for both PDF and image manipulation. Users can perform a wide range of tasks directly in their browser, from file conversion to content editing. Each tool is built as a modular React component, ensuring a clean and maintainable codebase.

## Implemented PDF Tools

### Organization

-   **Merge PDF:** Combine multiple PDF files into a single document.
-   **Split PDF:** Extract specific pages from a PDF to create a new file.
-   **Remove Pages:** Delete selected pages from a PDF.
-   **Extract Pages:** Create a new PDF from a selection of pages.
-   **Organize PDF:** Reorder, add, or delete pages within a PDF.

### Optimization

-   **Compress PDF:** Reduce the file size of a PDF.
-   **Repair PDF:** Attempt to fix corrupted or damaged PDF files.

### Conversion to PDF

-   **JPG to PDF:** Convert JPG images into a PDF document.
-   **WORD to PDF:** Convert Microsoft Word documents to PDF.
-   **PowerPoint to PDF:** Convert Microsoft PowerPoint documents to PDF.
-   **EXCEL to PDF:** Convert Microsoft Excel spreadsheets to PDF.
-   **HTML to PDF:** Convert HTML files to PDF.

### Conversion from PDF

-   **PDF to JPG:** Convert PDF pages to JPG images.

### PDF Editing

-   **Add Page Numbers:** Insert page numbers into a PDF.
-   **Add Watermark:** Apply a text or image watermark to a PDF.

### PDF Security

-   **Protect PDF:** Add a password to a PDF.
-   **Sign PDF:** Add a digital signature to a PDF.

## Implemented Image Tools

### Optimization

-   **Compress IMAGE:** Reduce the file size of images.

### Creation

-   **Meme Generator:** Create memes from images.
-   **Photo Editor:** Edit and enhance photos.

### Modification

-   **Resize IMAGE:** Change the dimensions of an image.
-   **Crop IMAGE:** Trim images to a desired size.
-   **Rotate IMAGE:** Rotate images.

### Conversion

-   **Convert to JPG:** Convert various image formats to JPG.
-   **Convert from JPG:** Convert JPG images to other formats (e.g., PNG, WebP).

### Security

-   **Watermark IMAGE:** Add a text or image watermark to an image.

---

## Latest Change: My Account Page

### Objective

To provide users with a personalized experience, a "My Account" page has been created. This page allows logged-in users to view their account details and manage their sessions.

### Key Features

-   **Account Details:** Displays the user's email address and unique user ID (UID).
-   **Sign Out:** Allows users to securely log out of their account.
-   **Protected Route:** The "My Account" page is a protected route, accessible only to authenticated users. Unauthenticated users will be redirected to the sign-in page.

### Technical Implementation

-   **`MyAccount.jsx`:** A new component that fetches and displays the current user's data from Firebase Authentication.
-   **`MyAccount.css`:** Provides styling for the "My Account" page, ensuring a clean and user-friendly layout.
-   **`Header.jsx`:** The header has been updated to include a "My Account" link, which is dynamically displayed only when a user is logged in.
-   **`router/index.jsx`:** A new route for `/my-account` has been added, linking to the `MyAccount.jsx` component.

This feature enhances the user experience by providing a dedicated space for account management, a crucial element for any application with user authentication.
