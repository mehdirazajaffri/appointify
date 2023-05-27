import * as React from "react";
import * as ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);


const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
     <RouterProvider router={router} />
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
