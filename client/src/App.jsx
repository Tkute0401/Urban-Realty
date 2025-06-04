import { Routes, Route, useLocation } from 'react-router-dom';
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
import AboutUs from './components/common/footer/AboutUs';
import ContactUs from './components/common/footer/ContactUs';
import HelpCenter from './components/common/footer/HelpCenter';
import PrivacyPolicy from './components/common/footer/PrivacyPolicy';
import TermsConditions from './components/common/footer/TermsConditions';
import Career from './components/common/footer/Career';
import TrustSafety from './components/common/footer/TrustSafety';
import HowWeWork from './components/common/footer/HowWeWork';
import Footer from './components/common/footer/Footer';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <ThemeProvider theme={urbanRealtyTheme}>
      <AuthProvider>
        <PropertiesProvider>
          <AgentsProvider>
            {/* Conditionally render Header based on current path */}
            {!isHomePage && <Header />}
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
                <Route path="/terms" element={<TermsConditions />}/>
                <Route path="/career" element={<Career />} />
                <Route path="/trust" element={<TrustSafety />}/>
                <Route path="/how-we-work" element={<HowWeWork />}/>

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
            <Footer />
          </AgentsProvider>
        </PropertiesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;