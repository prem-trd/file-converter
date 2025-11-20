# Project Blueprint

## Overview

This is a file converter application that allows users to convert files between different formats. The application is built using React and features a modern, user-friendly interface.

## Implemented Features

*   **JPG to PDF Conversion:**
    *   Users can upload multiple JPG and PNG images.
    *   Images can be reordered using drag-and-drop.
    *   Individual images can be rotated or deleted.
    *   The application converts the images into a single PDF document.
*   **Organize PDF:**
    *   Users can upload multiple PDF files.
    *   Pages can be reordered using drag-and-drop.
    *   Pages can be rotated or deleted.
    *   Blank pages can be added.
    *   The application merges and organizes the pages into a new PDF document.

## Current Plan: Word to PDF Conversion

1.  **Create `WordToPdf.jsx` Component:** Build the main page for the Word to PDF feature.
2.  **Implement UI:** Design a user interface similar to the JPG to PDF and Organize PDF pages, allowing users to upload a `.docx` file.
3.  **Add Conversion Logic:** Use the `docx-preview` library to render the Word document's content and `jspdf` to save it as a PDF.
4.  **Add Routing:** Integrate the new page into the application's routing in `App.jsx`.
5.  **Update Navigation:** Add a link to the new page in the main navigation bar.
