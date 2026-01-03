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

## Latest Change: Conversion Limit for Unregistered Users

### Objective

To encourage user sign-ups, a conversion limit has been implemented for all unregistered users. This feature restricts the number of conversions a guest user can perform within a 24-hour period, prompting them to create an account for unlimited access.

### Key Features

-   **Conversion Limit:** Unregistered users are limited to 5 conversions per day.
-   **Session-Based Tracking:** The conversion count and the last conversion date are tracked using the browser's `sessionStorage`.
-   **User-Friendly Notifications:** When the limit is reached, users are presented with a clear and concise message encouraging them to sign up.
-   **Unlimited Access for Registered Users:** The conversion limit is not applied to users who are logged in.

### Technical Implementation

-   **`conversionLimiter.jsx`:** A new utility module that provides the following functions:
    -   `checkConversionLimit()`: Checks if the user has reached their daily conversion limit.
    -   `incrementConversionCount()`: Increments the user's conversion count for the day.
-   **Tool Page Integration:** The `checkConversionLimit` and `incrementConversionCount` functions have been integrated into the following tool pages:
    -   `WordToPdf.jsx`
    -   `PptToPdf.jsx`
    -   `ExcelToPdf.jsx`
    -   `JpgToPdf.jsx`
    -   `HtmlToPdf.jsx`
    -   `PdfToJpg.jsx`
    -   `ConvertToJpg.jsx`
    -   `ConvertFromJpg.jsx`
-   **Authentication Context:** The `useAuth` hook is used to determine if a user is logged in. The conversion limit is only applied if `currentUser` is `null`.

This new feature incentivizes user registration, which will help to build a more engaged user base and provide valuable insights into user behavior.
