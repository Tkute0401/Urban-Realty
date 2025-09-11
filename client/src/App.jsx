import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AgentsProvider } from './context/AgentsContext';
import { PropertiesProvider } from './context/PropertiesContext';
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const PropertyList = lazy(() => import('./components/property/PropertyList'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails/PropertyDetails'));
const Profile = lazy(() => import('./pages/User/Profile'));
import Layout from './components/Layout/layout';
import 'leaflet/dist/leaflet.css';
import Header from './components/common/Header';
const EditProperty = lazy(() => import('./pages/Properties/EditProperty'));
const AddProperty = lazy(() => import('./pages/AddProperty/AddProperty'));
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createUrbanRealtyTheme } from './Theme/NewTheme';
import ThemeProviderCtx, { ThemeContext } from './context/ThemeProvider';
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AgentsPage = lazy(() => import('./pages/admin/AgentsPage'));
const AdminSubscriptionManagement = lazy(() => import('./components/admin/SubscriptionManagement'));
const AgentLayout = lazy(() => import('./components/agent/AgentLayout'));
const AgentDashboard = lazy(() => import('./pages/Agent/AgentDashboard'));
const AgentProperties = lazy(() => import('./pages/Agent/AgentProperties'));
const AgentLeads = lazy(() => import('./pages/Agent/AgentLeads'));
const AgentAnalytics = lazy(() => import('./pages/Agent/AgentAnalytics'));
const AgentInquiries = lazy(() => import('./pages/Agent/Inquiries'));
const AgentSettings = lazy(() => import('./pages/Agent/AgentSettings'));
import MainPage from './components/property/MainPage';
const AboutUs = lazy(() => import('./components/common/footer/AboutUs'));
const ContactUs = lazy(() => import('./components/common/footer/ContactUs'));
const HelpCenter = lazy(() => import('./components/common/footer/HelpCenter'));
const PrivacyPolicy = lazy(() => import('./components/common/footer/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./components/common/footer/TermsConditions'));
const Career = lazy(() => import('./components/common/footer/Career'));
const TrustSafety = lazy(() => import('./components/common/footer/TrustSafety'));
const HowWeWork = lazy(() => import('./components/common/footer/HowWeWork'));
const LawyerConsultancy = lazy(() => import('./components/common/footer/LaywerConsultancy'));
const PackersMovers = lazy(() => import('./components/common/footer/PackersMovers'));
const InteriorDesign = lazy(() => import('./components/common/footer/InteriorDesign'));
const EMICalculator = lazy(() => import('./components/common/footer/EMICalculator'));
import Footer from './components/common/footer/Footer';
import { DevelopersProvider } from './context/DevelopersContext';
const DeveloperList = lazy(() => import('./pages/Developer/DeveloperList'));
const DeveloperDetails = lazy(() => import('./pages/Developer/DeveloperDetails'));
const AddDeveloperPage = lazy(() => import('./pages/Developer/AddDeveloperPage'));
const EditDeveloperPage = lazy(() => import('./pages/Developer/EditDeveloperPage'));
const SubscriptionPlans = lazy(() => import('./components/Subscription/SubscriptionPlans'));
const SubscriptionManagement = lazy(() => import('./components/Subscription/SubscriptionManagement'));
const SubscriptionComparison = lazy(() => import('./components/Subscription/SubscriptionComparison'));
const BillingDashboard = lazy(() => import('./components/Subscription/BillingDashboard'));

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { theme } = React.useContext(ThemeContext);
  const muiTheme = React.useMemo(() => createUrbanRealtyTheme(theme), [theme]);
  
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <PropertiesProvider>
          <AgentsProvider>
          <DevelopersProvider>
          
            {/* Conditionally render Header based on current path */}
            {!isHomePage && <Header />}
            <Layout>
              <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/pg" element={<PropertyList />} />
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
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="subscriptions" element={<AdminSubscriptionManagement />} />
                  </Route>
                </Route>

                {/* Agent Routes */}
                <Route path="/agent" element={<ProtectedRoute allowedRoles={['agent']} />}>
                  <Route element={<AgentLayout />}>
                    <Route index element={<AgentDashboard />} />
                    <Route path="dashboard" element={<AgentDashboard />} />
                    <Route path="properties" element={<AgentProperties />} />
                    <Route path="leads" element={<AgentLeads />} />
                    <Route path="analytics" element={<AgentAnalytics />} />
                    <Route path="inquiries" element={<AgentInquiries />} />
                    <Route path="settings" element={<AgentSettings />} />
                  </Route>
                </Route>
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/properties/:id/edit" element={<EditProperty />} />
                  <Route path="/add-property" element={<AddProperty />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
              </Suspense>
            </Layout>
            <Footer />
            </DevelopersProvider>
          </AgentsProvider>
        </PropertiesProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default App;