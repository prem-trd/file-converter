
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import MergePdf from "../pages/MergePdf/MergePdf.jsx";
import SplitPdf from "../pages/SplitPdf/SplitPdf.jsx";
import RemovePages from "../pages/RemovePages/RemovePages.jsx";
import ExtractPages from "../pages/ExtractPages/ExtractPages.jsx";
import OrganizePdf from "../pages/OrganizePdf/OrganizePdf.jsx";
import CompressPdf from "../pages/CompressPdf/CompressPdf.jsx";
import RepairPdf from "../pages/RepairPdf/RepairPdf.jsx";
import JpgToPdf from "../pages/JpgToPdf/JpgToPdf.jsx";
import WordToPdf from "../pages/WordToPdf/WordToPdf.jsx";
import PptToPdf from "../pages/PptToPdf/PptToPdf.jsx";
import ExcelToPdf from "../pages/ExcelToPdf/ExcelToPdf.jsx";
import HtmlToPdf from "../pages/HtmlToPdf/HtmlToPdf.jsx";
import PdfToJpg from "../pages/PdfToJpg/PdfToJpg.jsx";
import AddPageNumbers from "../pages/AddPageNumbers/AddPageNumbers.jsx";
import AddWatermarkPdf from "../pages/AddWatermarkPdf/AddWatermarkPdf.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "merge-pdf",
          element: <MergePdf />,
        },
        {
          path: "split-pdf",
          element: <SplitPdf />,
        },
        {
          path: "remove-pages",
          element: <RemovePages />,
        },
        {
          path: "extract-pages",
          element: <ExtractPages />,
        },
        {
          path: "organize-pdf",
          element: <OrganizePdf />,
        },
        {
          path: "compress-pdf",
          element: <CompressPdf />,
        },
        {
          path: "repair-pdf",
          element: <RepairPdf />,
        },
        {
          path: "jpg-to-pdf",
          element: <JpgToPdf />,
        },
        {
          path: "word-to-pdf",
          element: <WordToPdf />,
        },
        {
          path: "powerpoint-to-pdf",
          element: <PptToPdf />,
        },
        {
          path: "excel-to-pdf",
          element: <ExcelToPdf />,
        },
        {
          path: "html-to-pdf",
          element: <HtmlToPdf />,
        },
        {
          path: "pdf-to-jpg",
          element: <PdfToJpg />,
        },
        {
          path: "add-page-numbers",
          element: <AddPageNumbers />,
        },
        {
          path: "add-watermark-pdf",
          element: <AddWatermarkPdf />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;
