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

## Latest Change: CSS Class Name Refactoring

### Objective

To refactor shared and generic CSS class names across multiple components into unique, component-specific class names. This prevents style collisions and improves code maintainability by ensuring that styles for one component do not unintentionally affect another.

### Components Refactored

1.  **`WatermarkImage`**
    *   **Files:** `src/pages/WatermarkImage/WatermarkImage.jsx`, `src/pages/WatermarkImage/WatermarkImage.css`
    *   **Change:** All CSS classes were prefixed with `watermark-image-`.

2.  **`ConvertFromJpg`**
    *   **Files:** `src/pages/ConvertFromJpg/ConvertFromJpg.jsx`, `src/pages/ConvertFromJpg/ConvertFromJpg.css`
    *   **Change:** All CSS classes were prefixed with `convert-from-jpg-`.

3.  **`ConvertToJpg`**
    *   **Files:** `src/pages/ConvertToJpg/ConvertToJpg.jsx`, `src/pages/ConvertToJpg/ConvertToJpg.css`
    *   **Change:** All CSS classes were prefixed with `convert-to-jpg-`.
