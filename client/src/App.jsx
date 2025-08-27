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
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';
import AdminContacts from './pages/admin/AdminContacts';
import AdminMedia from './pages/admin/AdminMedia';
import AdminReports from './pages/admin/AdminReports';
import AdminSystemHealth from './pages/admin/AdminSystemHealth';
import AdminAPIManagement from './pages/admin/AdminAPIManagement';
import AdminDatabase from './pages/admin/AdminDatabase';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminSettings from './pages/admin/AdminSettings';
import AgentsPage from './pages/admin/AgentsPage';
import AdminSubscriptionManagement from './components/admin/SubscriptionManagement';
import MainPage from './components/property/MainPage';
import AboutUs from './components/common/footer/AboutUs';
import ContactUs from './components/common/footer/ContactUs';
import HelpCenter from './components/common/footer/HelpCenter';
import PrivacyPolicy from './components/common/footer/PrivacyPolicy';
import TermsConditions from './components/common/footer/TermsConditions';
import Career from './components/common/footer/Career';
import TrustSafety from './components/common/footer/TrustSafety';
import HowWeWork from './components/common/footer/HowWeWork';
import LawyerConsultancy from './components/common/footer/LaywerConsultancy';
import PackersMovers from './components/common/footer/PackersMovers';
import InteriorDesign from './components/common/footer/InteriorDesign';
import EMICalculator from './components/common/footer/EMICalculator';
import Footer from './components/common/footer/Footer';
import { DevelopersProvider } from './context/DevelopersContext';
import DeveloperList from './pages/Developer/DeveloperList';
import DeveloperDetails from './pages/Developer/DeveloperDetails';
import AddDeveloperPage from './pages/Developer/AddDeveloperPage';
import EditDeveloperPage from './pages/Developer/EditDeveloperPage';
import SubscriptionPlans from './components/Subscription/SubscriptionPlans';
import SubscriptionManagement from './components/Subscription/SubscriptionManagement';
import SubscriptionComparison from './components/Subscription/SubscriptionComparison';
import BillingDashboard from './components/Subscription/BillingDashboard';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <ThemeProvider theme={urbanRealtyTheme}>
      <AuthProvider>
        <PropertiesProvider>
          <AgentsProvider>
          <DevelopersProvider>
          
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
                <Route path="/developers" element={<DeveloperList />}/>
                <Route path="/developers/:id" element={<DeveloperDetails />} />
                <Route path="/developers/add" element={<AddDeveloperPage/>}/>
                <Route path="/developers/:id/edit" element={<EditDeveloperPage/>}/>
                <Route path="/how-we-work" element={<HowWeWork />}/>
                <Route path="/lawyer-consultancy" element={<LawyerConsultancy />}/>
                <Route path="/packers-and-movers" element={<PackersMovers />}/>
                <Route path="/interior-design" element={<InteriorDesign />}/>
                <Route path="/emi-calculator" element={<EMICalculator />}/>
                        <Route path="/subscriptions" element={<SubscriptionPlans />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/subscription-comparison" element={<SubscriptionComparison />} />
        <Route path="/billing-dashboard" element={<BillingDashboard />} />

                {/* Admin Routes */}
                                      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route element={<AdminLayout />}>
                          <Route index element={<AdminDashboard />} />
                          <Route path="analytics" element={<AdminAnalytics />} />
                          <Route path="agents" element={<AgentsPage />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="properties" element={<AdminProperties />} />
                          <Route path="contacts" element={<AdminContacts />} />
                          <Route path="media" element={<AdminMedia />} />
                          <Route path="reports" element={<AdminReports />} />
                          <Route path="system-health" element={<AdminSystemHealth />} />
                          <Route path="api-management" element={<AdminAPIManagement />} />
                          <Route path="database" element={<AdminDatabase />} />
                          <Route path="security" element={<AdminSecurity />} />
                          <Route path="settings" element={<AdminSettings />} />
                          <Route path="subscriptions" element={<AdminSubscriptionManagement />} />
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
            </DevelopersProvider>
          </AgentsProvider>
        </PropertiesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;