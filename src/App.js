import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import Listeasy from "./pages/list/Listeasy";
import Rejected from "./pages/list/Rejected";
import { Toaster } from "react-hot-toast";
import Listproducts from "./pages/list/Listproducts";
import ApprovedUsers from "./components/approvedusers/ApprovedUsers";
import ApprovedUser from "./pages/list/ApprovedUsers";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const {currentUser} = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
             <Route path="easypisatable">
              <Route
                index
                element={
                  <RequireAuth>
                    <Listeasy />
                  </RequireAuth>
                }
              />
              </Route>
             <Route path="rejecteduser">
              <Route
                index
                element={
                  <RequireAuth>
                    <Rejected />
                  </RequireAuth>
                }
              />
              </Route>
              <Route path="approvedusers">
              <Route
                index
                element={
                  <RequireAuth>
                    <ApprovedUser/>
                  </RequireAuth>
                }
              />
              </Route>
             <Route path="products">
              <Route
                index
                element={
                  <RequireAuth>
                    <Listproducts/>
                  </RequireAuth>
                }
              />
              </Route>
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              />
           
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
             
              
            </Route>
            <Route path="products">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              />
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New inputs={productInputs} title="Add New Product" />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
        <Toaster/>
      </BrowserRouter>
    </div>
  );
}

export default App;
