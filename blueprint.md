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
-   **EXCEL to PDF:** Convert Microsoft Excel spreadsheets to PDF.

### PDF Editing

-   **Add Page Numbers:** Insert page numbers into a PDF.
-   **Add Watermark:** Apply a text or image watermark to a PDF.

### PDF Security

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

## Latest Change: Footer Simplification

### Objective

To simplify the footer for a cleaner, more minimalist design suitable for an individual developer. The previous footer with social media links was replaced with a simple copyright notice and essential links.

### Implementation Steps

1.  **`Footer.jsx` Refactoring:**
    *   The component at `src/components/layout/Footer.jsx` was updated.
    *   The new structure consists of a copyright notice on the left and four links (Privacy Notice, Terms & Conditions, Imprint, Contact Us) on the right.

2.  **`Footer.css` Styling Update:**
    *   The CSS file at `src/components/layout/Footer.css` was updated to reflect the new design.
    *   The new styling uses a light background (`#f8f9fa`), subtle text color (`#6c757d`), and a clean, horizontal layout using Flexbox, inspired by the user-provided image.
