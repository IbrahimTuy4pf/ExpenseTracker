
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Navbar from "./components/navbar";
import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import Settings from "./pages/Settings";

import useStore from "./store";

const ProtectedRoute = ({ children }) => {

  const { user, token } = useStore();
  

  return user && token ? children : <Navigate to="/login" replace />;
};


const App = () => {

  const { theme, user, token } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);


  return (
    
    <BrowserRouter>

      <main className={theme}>

        <div className='w-full px-4 md:px-8 lg:px-12 xl:px-20 min-h-screen pb-12'>

          {user && token && <Navbar />}
        
          <Routes>
        
            <Route
              path="/login"
              element={user && token ? <Navigate to="/" replace /> : <Login />}
            />
        
            <Route
              path="/auth/callback"
              element={<AuthCallback />}
            />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
         
            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  <Accounts />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
        
            <Route path="*" 
            element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
};

export default App;
