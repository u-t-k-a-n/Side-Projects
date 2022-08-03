import React from 'react';
import Signup from './authentication/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './authentication/Profile';
import Login from './authentication/Login';
import PrivateRoute from './authentication/PrivateRoute';
import ForgotPassword from './authentication/ForgotPassword';
import UpdateProfile from './authentication/UpdateProfile';
import Dashboard from './google-drive/Dashboard';



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route exact path="/folder/:folderId"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />


        <Route
          path="/user"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
