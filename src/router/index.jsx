
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
import ProtectPdf from "../pages/ProtectPdf/ProtectPdf.jsx";
import SignPdf from "../pages/SignPdf/SignPdf.jsx";
import CompressImage from "../pages/CompressImage/CompressImage.jsx";
import MemeGenerator from "../pages/MemeGenerator/MemeGenerator.jsx";
import PhotoEditor from "../pages/PhotoEditor/PhotoEditor.jsx";
import ResizeImage from "../pages/ResizeImage/ResizeImage.jsx";
import CropImage from "../pages/CropImage/CropImage.jsx";
import RotateImage from "../pages/RotateImage/RotateImage.jsx";
import ConvertToJpg from "../pages/ConvertToJpg/ConvertToJpg.jsx";
import ConvertFromJpg from "../pages/ConvertFromJpg/ConvertFromJpg.jsx";
import WatermarkImage from "../pages/WatermarkImage/WatermarkImage.jsx";
import PrivacyNotice from "../pages/PrivacyNotice/PrivacyNotice.jsx";
import TermsAndConditions from "../pages/TermsAndConditions/TermsAndConditions.jsx";
import ContactUs from "../pages/ContactUs/ContactUs.jsx";
import ThankYou from "../pages/ThankYou/ThankYou.jsx";

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
          path: "watermark-image",
          element: <WatermarkImage />,
        },
        {
          path: "protect-pdf",
          element: <ProtectPdf />,
        },
        {
          path: "sign-pdf",
          element: <SignPdf />,
        },
        {
          path: "compress-image",
          element: <CompressImage />,
        },
        {
          path: "resize-image",
          element: <ResizeImage />,
        },
        {
          path: "crop-image",
          element: <CropImage />,
        },
        {
          path: "rotate-image",
          element: <RotateImage />,
        },
        {
          path: "convert-to-jpg",
          element: <ConvertToJpg />,
        },
        {
          path: "convert-from-jpg",
          element: <ConvertFromJpg />,
        },
        {
          path: "meme-generator",
          element: <MemeGenerator />,
        },
        {
          path: "photo-editor",
          element: <PhotoEditor />,
        },
        {
            path: "privacy-notice",
            element: <PrivacyNotice />,
        },
        {
            path: "terms-and-conditions",
            element: <TermsAndConditions />,
        },
        {
            path: "contact-us",
            element: <ContactUs />,
        },
        {
          path: "/thank-you",
          element: <ThankYou />,
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
