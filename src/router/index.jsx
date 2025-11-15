
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
