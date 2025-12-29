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

## Latest Change: Branded Filename Convention

### Objective

To enhance brand identity and provide users with more descriptive filenames, all downloadable files will now follow a standardized naming convention.

### PDF Tool Updates

1.  **`JpgToPdf.jsx`:** Saves the converted file as `jpg-to-pdf-smartconverter.pdf`.
2.  **`MergePdf.jsx`:** Saves the merged document as `merge-pdf-smartconverter.pdf`.
3.  **`OrganizePdf.jsx`:** Saves the organized PDF as `organize-pdf-smartconverter.pdf`.
4.  **`ProtectPdf.jsx`:** Saves the encrypted file as `protect-pdf-smartconverter-[original-file-name].pdf`.
5.  **`SplitPdf.jsx`:** Generates a zip file named `split-pdf-smartconverter-[original-file-name].zip`.
6.  **`WordToPdf.jsx`:** Saves the converted file as `word-to-pdf-smartconverter-[original-file-name].pdf`.

### Image Tool Updates

1.  **`CompressImage.jsx`:** Saves the compressed file as `compress-image-smartconverter-[original-file-name]`.
2.  **`MemeGenerator.jsx`:** Saves the generated meme as `meme-generator-smartconverter.png`.
3.  **`PhotoEditor.jsx`:** Saves the edited photo as `photo-editor-smartconverter.png`.
4.  **`ResizeImage.jsx`:** Saves the resized image as `resize-image-smartconverter-[original-file-name]`.
5.  **`CropImage.jsx`:** Saves the cropped image as `crop-image-smartconverter-[original-file-name].jpeg`.
6.  **`RotateImage.jsx`:** Saves the rotated image as `rotate-image-smartconverter.jpeg`.
7.  **`WatermarkImage.jsx`:** Saves the watermarked image as `watermark-image-smartconverter.png`.

This systematic update ensures a consistent and branded user experience across all file download functionalities.
