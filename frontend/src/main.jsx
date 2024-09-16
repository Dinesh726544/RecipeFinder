import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "./components/Home/Home.jsx";
import Login from "./components/Pages/Login.jsx";
import Register from "./components/Pages/Register.jsx";
import Dashboard from "./components/Pages/Dashboard.jsx";
import store from "../src/app/store.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Provider } from "react-redux";
import History from "./components/Pages/History.jsx";
import { SnackbarProvider } from "notistack";
import Logout from "./components/Pages/Logout.jsx";
import DeleteHistoryById from "./components/Pages/DeleteHistoryById.jsx";
import DeleteAllHistory from "./components/Pages/DeleteAllHistory.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* Protect the dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Protect the History route */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      {/* Protect the logout route */}
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />
      {/* Protect the History route to delete by promptId */}
      <Route
        path="/deleteById/:promptId"
        element={
          <ProtectedRoute>
            <DeleteHistoryById />
          </ProtectedRoute>
        }
      />
      {/* Protect the History route to delete all history*/}
      <Route
        path="/DeleteAllHistory"
        element={
          <ProtectedRoute>
            <DeleteAllHistory />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </Provider>
  </StrictMode>
);
