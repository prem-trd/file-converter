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

## Latest Change: Code Refactoring and Cleanup

### Objective

To improve code quality, remove redundancies, and ensure the project is clean and maintainable.

### Implementation Steps

1.  **`tools.jsx` Cleanup:** Updated `src/data/tools.jsx` to remove commented-out and unavailable tool definitions. This ensures the dashboard accurately reflects the application's implemented features.
2.  **Redundant Component Removal:** Deleted the `src/pages/AddWatermark` directory and its contents (`AddWatermark.jsx`, `AddWatermark.css`). This component was a duplicate of the more feature-rich `AddWatermarkPdf.jsx`.
3.  **Router Verification:** Confirmed that `src/router/index.jsx` correctly routes to the `AddWatermarkPdf` component and does not contain any broken links from the deleted component.
