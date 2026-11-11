/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignInSIMONA from "./pages/SignInSIMONA";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function ProtectedRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Main>
            <Component {...props} />
          </Main>
        ) : (
          <Redirect to="/sign-in" />
        )
      }
    />
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user already logged in
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div className="App">
      <Switch>
        <Route path="/sign-in" exact>
          {isAuthenticated ? (
            <Redirect to="/dashboard" />
          ) : (
            <SignInSIMONA />
          )}
        </Route>

        <ProtectedRoute
          exact
          path="/dashboard"
          component={Dashboard}
          isAuthenticated={isAuthenticated}
        />
        
        <ProtectedRoute
          exact
          path="/tables"
          component={Tables}
          isAuthenticated={isAuthenticated}
        />
        
        <ProtectedRoute
          exact
          path="/billing"
          component={Billing}
          isAuthenticated={isAuthenticated}
        />
        
        <ProtectedRoute
          exact
          path="/profile"
          component={Profile}
          isAuthenticated={isAuthenticated}
        />

        <Redirect from="*" to={isAuthenticated ? "/dashboard" : "/sign-in"} />
      </Switch>
    </div>
  );
}

export default App;
