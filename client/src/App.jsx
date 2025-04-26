import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AgentsProvider } from './context/AgentsContext';
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
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';
import AdminContacts from './pages/admin/AdminContacts';
import AgentsPage from './pages/admin/AgentsPage';
import MainPage from './components/property/MainPage';

function App() {
  return (
    <ThemeProvider theme={urbanRealtyTheme}>
    
    <AuthProvider>
      <PropertiesProvider>
      <AgentsProvider>
        <Header />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="agents" element={<AgentsPage />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="properties" element={<AdminProperties />} />
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
        </AgentsProvider>
      </PropertiesProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;