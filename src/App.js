import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateSnippet from './pages/CreateSnippet';
import SnippetDetail from './pages/SnippetDetail';
import theme from './theme';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Box>Loading...</Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Box>Loading...</Box>
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    // <Router>
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Box as="main" py={8}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/snippets/new"
              element={
                <ProtectedRoute>
                  <CreateSnippet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/snippets/:id"
              element={
                <ProtectedRoute>
                  <SnippetDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    // </Router>
  );
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      </Router>
     
    </ChakraProvider>
  );
};

export default App;
