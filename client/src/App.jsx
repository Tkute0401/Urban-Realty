import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PropertiesProvider } from './context/PropertiesContext';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PropertyList from './components/property/PropertyList';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails';
import Profile from './pages/User/Profile';
import Layout from './components/Layout/layout';
import 'leaflet/dist/leaflet.css';
import Header from './components/common/Header';
import EditProperty from './pages/Properties/EditProperty';
import AddProperty from './pages/AddProperty/AddProperty';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider } from '@mui/material';
import { urbanRealtyTheme } from './Theme/NewTheme';
import RoleRoute from './components/common/RoleRoute';

function App() {
  return (
    <ThemeProvider theme={urbanRealtyTheme}>
    <AuthProvider>
      <PropertiesProvider>
        <Header />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="agents" element={<AdminAgents />} />
                  <Route path="contacts" element={<AdminContacts />} />
                </Route>
            </Route>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/properties/:id/edit" element={<EditProperty />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Layout>
      </PropertiesProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;