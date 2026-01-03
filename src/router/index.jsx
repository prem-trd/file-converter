
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Loader from "../components/Loader";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Signin = lazy(() => import("../pages/Signin/Signin.jsx"));
const Signup = lazy(() => import("../pages/Signup/Signup.jsx"));
const MergePdf = lazy(() => import("../pages/MergePdf/MergePdf.jsx"));
const SplitPdf = lazy(() => import("../pages/SplitPdf/SplitPdf.jsx"));
const RemovePages = lazy(() => import("../pages/RemovePages/RemovePages.jsx"));
const ExtractPages = lazy(() => import("../pages/ExtractPages/ExtractPages.jsx"));
const OrganizePdf = lazy(() => import("../pages/OrganizePdf/OrganizePdf.jsx"));
const CompressPdf = lazy(() => import("../pages/CompressPdf/CompressPdf.jsx"));
const RepairPdf = lazy(() => import("../pages/RepairPdf/RepairPdf.jsx"));
const JpgToPdf = lazy(() => import("../pages/JpgToPdf/JpgToPdf.jsx"));
const WordToPdf = lazy(() => import("../pages/WordToPdf/WordToPdf.jsx"));
const PptToPdf = lazy(() => import("../pages/PptToPdf/PptToPdf.jsx"));
const ExcelToPdf = lazy(() => import("../pages/ExcelToPdf/ExcelToPdf.jsx"));
const HtmlToPdf = lazy(() => import("../pages/HtmlToPdf/HtmlToPdf.jsx"));
const PdfToJpg = lazy(() => import("../pages/PdfToJpg/PdfToJpg.jsx"));
const AddPageNumbers = lazy(() => import("../pages/AddPageNumbers/AddPageNumbers.jsx"));
const AddWatermarkPdf = lazy(() => import("../pages/AddWatermarkPdf/AddWatermarkPdf.jsx"));
const ProtectPdf = lazy(() => import("../pages/ProtectPdf/ProtectPdf.jsx"));
const SignPdf = lazy(() => import("../pages/SignPdf/SignPdf.jsx"));
const CompressImage = lazy(() => import("../pages/CompressImage/CompressImage.jsx"));
const MemeGenerator = lazy(() => import("../pages/MemeGenerator/MemeGenerator.jsx"));
const PhotoEditor = lazy(() => import("../pages/PhotoEditor/PhotoEditor.jsx"));
const ResizeImage = lazy(() => import("../pages/ResizeImage/ResizeImage.jsx"));
const CropImage = lazy(() => import("../pages/CropImage/CropImage.jsx"));
const RotateImage = lazy(() => import("../pages/RotateImage/RotateImage.jsx"));
const ConvertToJpg = lazy(() => import("../pages/ConvertToJpg/ConvertToJpg.jsx"));
const ConvertFromJpg = lazy(() => import("../pages/ConvertFromJpg/ConvertFromJpg.jsx"));
const WatermarkImage = lazy(() => import("../pages/WatermarkImage/WatermarkImage.jsx"));
const PrivacyNotice = lazy(() => import("../pages/PrivacyNotice/PrivacyNotice.jsx"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndConditions/TermsAndConditions.jsx"));
const ContactUs = lazy(() => import("../pages/ContactUs/ContactUs.jsx"));
const ThankYou = lazy(() => import("../pages/ThankYou/ThankYou.jsx"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Suspense fallback={<Loader />}><Dashboard /></Suspense>,
        },
        {
          path: "merge-pdf",
          element: <Suspense fallback={<Loader />}><MergePdf /></Suspense>,
        },
        {
          path: "split-pdf",
          element: <Suspense fallback={<Loader />}><SplitPdf /></Suspense>,
        },
        {
          path: "remove-pages",
          element: <Suspense fallback={<Loader />}><RemovePages /></Suspense>,
        },
        {
          path: "extract-pages",
          element: <Suspense fallback={<Loader />}><ExtractPages /></Suspense>,
        },
        {
          path: "organize-pdf",
          element: <Suspense fallback={<Loader />}><OrganizePdf /></Suspense>,
        },
        {
          path: "compress-pdf",
          element: <Suspense fallback={<Loader />}><CompressPdf /></Suspense>,
        },
        {
          path: "repair-pdf",
          element: <Suspense fallback={<Loader />}><RepairPdf /></Suspense>,
        },
        {
          path: "jpg-to-pdf",
          element: <Suspense fallback={<Loader />}><JpgToPdf /></Suspense>,
        },
        {
          path: "word-to-pdf",
          element: <Suspense fallback={<Loader />}><WordToPdf /></Suspense>,
        },
        {
          path: "powerpoint-to-pdf",
          element: <Suspense fallback={<Loader />}><PptToPdf /></Suspense>,
        },
        {
          path: "excel-to-pdf",
          element: <Suspense fallback={<Loader />}><ExcelToPdf /></Suspense>,
        },
        {
          path: "html-to-pdf",
          element: <Suspense fallback={<Loader />}><HtmlToPdf /></Suspense>,
        },
        {
          path: "pdf-to-jpg",
          element: <Suspense fallback={<Loader />}><PdfToJpg /></Suspense>,
        },
        {
          path: "add-page-numbers",
          element: <Suspense fallback={<Loader />}><AddPageNumbers /></Suspense>,
        },
        {
          path: "add-watermark-pdf",
          element: <Suspense fallback={<Loader />}><AddWatermarkPdf /></Suspense>,
        },
        {
          path: "watermark-image",
          element: <Suspense fallback={<Loader />}><WatermarkImage /></Suspense>,
        },
        {
          path: "protect-pdf",
          element: <Suspense fallback={<Loader />}><ProtectPdf /></Suspense>,
        },
        {
          path: "sign-pdf",
          element: <Suspense fallback={<Loader />}><SignPdf /></Suspense>,
        },
        {
          path: "compress-image",
          element: <Suspense fallback={<Loader />}><CompressImage /></Suspense>,
        },
        {
          path: "resize-image",
          element: <Suspense fallback={<Loader />}><ResizeImage /></Suspense>,
        },
        {
          path: "crop-image",
          element: <Suspense fallback={<Loader />}><CropImage /></Suspense>,
        },
        {
          path: "rotate-image",
          element: <Suspense fallback={<Loader />}><RotateImage /></Suspense>,
        },
        {
          path: "convert-to-jpg",
          element: <Suspense fallback={<Loader />}><ConvertToJpg /></Suspense>,
        },
        {
          path: "convert-from-jpg",
          element: <Suspense fallback={<Loader />}><ConvertFromJpg /></Suspense>,
        },
        {
          path: "meme-generator",
          element: <Suspense fallback={<Loader />}><MemeGenerator /></Suspense>,
        },
        {
          path: "photo-editor",
          element: <Suspense fallback={<Loader />}><PhotoEditor /></Suspense>,
        },
        {
          path: "privacy-notice",
          element: <Suspense fallback={<Loader />}><PrivacyNotice /></Suspense>,
        },
        {
          path: "terms-and-conditions",
          element: <Suspense fallback={<Loader />}><TermsAndConditions /></Suspense>,
        },
        {
          path: "contact-us",
          element: <Suspense fallback={<Loader />}><ContactUs /></Suspense>,
        },
        {
          path: "thank-you",
          element: <Suspense fallback={<Loader />}><ThankYou /></Suspense>,
        },
        {
          path: "*",
          element: <Suspense fallback={<Loader />}><NotFound /></Suspense>,
        },
      ],
    },
    {
      path: "/signin",
      element: <Suspense fallback={<Loader />}><Signin /></Suspense>,
    },
    {
      path: "/signup",
      element: <Suspense fallback={<Loader />}><Signup /></Suspense>,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;
