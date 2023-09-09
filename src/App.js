import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import Listeasy from "./pages/list/Listeasy";
import Rejected from "./pages/list/Rejected";
import { Toaster } from "react-hot-toast";
import Listproducts from "./pages/list/Listproducts";
import ApprovedUser from "./pages/list/ApprovedUsers";
import Setting from "./pages/list/Setting";

import { Provider } from 'react-redux';
import store from './redux/store';
import Level from "./pages/list/Level";
import WithdrwaRequests from "./pages/list/WithdrwaRequests";

function App( ) {
  const { darkMode } = useContext(DarkModeContext);

  const {currentUser} = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
        <Provider store={store}>
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
           
              
             
              
            </Route>

            <Route path="levels">
              <Route
                index
                element={
                  <RequireAuth>
                    <Level />
                  </RequireAuth>
                }
              />
           
              
             
              
            </Route>
            <Route path="withdrwa">
              <Route
                index
                element={
                  <RequireAuth>
                    <WithdrwaRequests/>
                  </RequireAuth>
                }
              />
           
              
             
              
            </Route>

            <Route path="settings">
              <Route
                index
                element={
                  <RequireAuth>
                    <Setting />
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
              
              
            </Route>
          </Route>
        </Routes>
        <Toaster/>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
