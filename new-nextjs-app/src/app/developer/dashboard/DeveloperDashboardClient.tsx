'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Snackbar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack
} from '@mui/material';
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  Assessment as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewsIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Construction as ConstructionIcon,
  Apartment as ApartmentIcon,
  Store as StoreIcon,
  Villa as VillaIcon,
  Hotel as HotelIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  ShoppingCart as ShoppingIcon,
  DirectionsCar as ParkingIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  Wifi as WifiIcon,
  Security as SecurityIcon,
  Elevator as ElevatorIcon,
  AcUnit as AcIcon,
  LocalParking as ParkingIcon2,
  Pets as PetIcon,
  SmokingRooms as SmokingIcon,
  SmokingRoomsOff as NoSmokingIcon,
  Restaurant as RestaurantIcon,
  LocalBar as BarIcon,
  Movie as CinemaIcon,
  SportsTennis as TennisIcon,
  SportsBasketball as BasketballIcon,
  SportsSoccer as SoccerIcon,
  SportsVolleyball as VolleyballIcon,
  SportsCricket as CricketIcon,
  SportsGolf as GolfIcon,
  SportsHockey as HockeyIcon,
  SportsBaseball as BaseballIcon,
  SportsFootball as FootballIcon,
  SportsRugby as RugbyIcon,
  SportsHandball as HandballIcon,
  SportsKabaddi as KabaddiIcon,
  SportsMartialArts as MartialArtsIcon,
  SportsBoxing as BoxingIcon,
  SportsWrestling as WrestlingIcon,
  SportsJudo as JudoIcon,
  SportsKarate as KarateIcon,
  SportsTaekwondo as TaekwondoIcon,
  SportsKickboxing as KickboxingIcon,
  SportsMuayThai as MuayThaiIcon,
  SportsCapoeira as CapoeiraIcon,
  SportsAikido as AikidoIcon,
  SportsJiuJitsu as JiuJitsuIcon,
  SportsSambo as SamboIcon,
  SportsSumo as SumoIcon,
  SportsKendo as KendoIcon,
  SportsFencing as FencingIcon,
  SportsArchery as ArcheryIcon,
  SportsShooting as ShootingIcon,
  SportsCycling as CyclingIcon,
  SportsRunning as RunningIcon,
  SportsWalking as WalkingIcon,
  SportsHiking as HikingIcon,
  SportsClimbing as ClimbingIcon,
  SportsSkiing as SkiingIcon,
  SportsSnowboarding as SnowboardingIcon,
  SportsSkating as SkatingIcon,
  SportsIceSkating as IceSkatingIcon,
  SportsHockey as IceHockeyIcon,
  SportsCurling as CurlingIcon,
  SportsBobsled as BobsledIcon,
  SportsLuge as LugeIcon,
  SportsSkeleton as SkeletonIcon,
  SportsBiathlon as BiathlonIcon,
  SportsCrossCountrySkiing as CrossCountrySkiingIcon,
  SportsAlpineSkiing as AlpineSkiingIcon,
  SportsFreestyleSkiing as FreestyleSkiingIcon,
  SportsNordicCombined as NordicCombinedIcon,
  SportsSkiJumping as SkiJumpingIcon,
  SportsSpeedSkating as SpeedSkatingIcon,
  SportsShortTrackSpeedSkating as ShortTrackSpeedSkatingIcon,
  SportsFigureSkating as FigureSkatingIcon,
  SportsSynchronizedSkating as SynchronizedSkatingIcon,
  SportsIceDancing as IceDancingIcon,
  SportsBandy as BandyIcon,
  SportsRinkHockey as RinkHockeyIcon,
  SportsFloorball as FloorballIcon,
  SportsUnihockey as UnihockeyIcon,
  SportsInlineHockey as InlineHockeyIcon,
  SportsRollerHockey as RollerHockeyIcon,
  SportsStreetHockey as StreetHockeyIcon,
  SportsBallHockey as BallHockeyIcon,
  SportsDekHockey as DekHockeyIcon,
  SportsCosomHockey as CosomHockeyIcon,
  SportsSledgeHockey as SledgeHockeyIcon,
  SportsParaIceHockey as ParaIceHockeyIcon,
  SportsWheelchairHockey as WheelchairHockeyIcon,
  SportsElectricWheelchairHockey as ElectricWheelchairHockeyIcon,
  SportsPowerHockey as PowerHockeyIcon,
  SportsStandingHockey as StandingHockeyIcon,
  SportsSittingHockey as SittingHockeyIcon,
  SportsBlindHockey as BlindHockeyIcon,
  SportsDeafHockey as DeafHockeyIcon,
  SportsIntellectualDisabilityHockey as IntellectualDisabilityHockeyIcon,
  SportsPhysicalDisabilityHockey as PhysicalDisabilityHockeyIcon,
  SportsVisualDisabilityHockey as VisualDisabilityHockeyIcon,
  SportsHearingDisabilityHockey as HearingDisabilityHockeyIcon,
  SportsCognitiveDisabilityHockey as CognitiveDisabilityHockeyIcon,
  SportsDevelopmentalDisabilityHockey as DevelopmentalDisabilityHockeyIcon,
  SportsLearningDisabilityHockey as LearningDisabilityHockeyIcon,
  SportsAttentionDeficitDisabilityHockey as AttentionDeficitDisabilityHockeyIcon,
  SportsAutismSpectrumDisabilityHockey as AutismSpectrumDisabilityHockeyIcon,
  SportsDownSyndromeDisabilityHockey as DownSyndromeDisabilityHockeyIcon,
  SportsCerebralPalsyDisabilityHockey as CerebralPalsyDisabilityHockeyIcon,
  SportsSpinaBifidaDisabilityHockey as SpinaBifidaDisabilityHockeyIcon,
  SportsMuscularDystrophyDisabilityHockey as MuscularDystrophyDisabilityHockeyIcon,
  SportsMultipleSclerosisDisabilityHockey as MultipleSclerosisDisabilityHockeyIcon,
  SportsParkinsonDisabilityHockey as ParkinsonDisabilityHockeyIcon,
  SportsAlzheimerDisabilityHockey as AlzheimerDisabilityHockeyIcon,
  SportsDementiaDisabilityHockey as DementiaDisabilityHockeyIcon,
  SportsStrokeDisabilityHockey as StrokeDisabilityHockeyIcon,
  SportsEpilepsyDisabilityHockey as EpilepsyDisabilityHockeyIcon,
  SportsDiabetesDisabilityHockey as DiabetesDisabilityHockeyIcon,
  SportsHeartDiseaseDisabilityHockey as HeartDiseaseDisabilityHockeyIcon,
  SportsCancerDisabilityHockey as CancerDisabilityHockeyIcon,
  SportsHIVDisabilityHockey as HIVDisabilityHockeyIcon,
  SportsAIDSDiabilityHockey as AIDSDiabilityHockeyIcon,
  SportsHepatitisDisabilityHockey as HepatitisDisabilityHockeyIcon,
  SportsTuberculosisDisabilityHockey as TuberculosisDisabilityHockeyIcon,
  SportsMalariaDisabilityHockey as MalariaDisabilityHockeyIcon,
  SportsDengueDisabilityHockey as DengueDisabilityHockeyIcon,
  SportsChikungunyaDisabilityHockey as ChikungunyaDisabilityHockeyIcon,
  SportsZikaDisabilityHockey as ZikaDisabilityHockeyIcon,
  SportsEbolaDisabilityHockey as EbolaDisabilityHockeyIcon,
  SportsMarburgDisabilityHockey as MarburgDisabilityHockeyIcon,
  SportsLassaDisabilityHockey as LassaDisabilityHockeyIcon,
  SportsRiftValleyDisabilityHockey as RiftValleyDisabilityHockeyIcon,
  SportsCrimeanCongoDisabilityHockey as CrimeanCongoDisabilityHockeyIcon,
  SportsNipahDisabilityHockey as NipahDisabilityHockeyIcon,
  SportsHendraDisabilityHockey as HendraDisabilityHockeyIcon,
  SportsMERSDisabilityHockey as MERSDisabilityHockeyIcon,
  SportsSARSDisabilityHockey as SARSDisabilityHockeyIcon,
  SportsCOVID19DisabilityHockey as COVID19DisabilityHockeyIcon,
  SportsInfluenzaDisabilityHockey as InfluenzaDisabilityHockeyIcon,
  SportsRSVDisabilityHockey as RSVDisabilityHockeyIcon,
  SportsAdenovirusDisabilityHockey as AdenovirusDisabilityHockeyIcon,
  SportsRhinovirusDisabilityHockey as RhinovirusDisabilityHockeyIcon,
  SportsCoronavirusDisabilityHockey as CoronavirusDisabilityHockeyIcon,
  SportsParainfluenzaDisabilityHockey as ParainfluenzaDisabilityHockeyIcon,
  SportsMetapneumovirusDisabilityHockey as MetapneumovirusDisabilityHockeyIcon,
  SportsBocavirusDisabilityHockey as BocavirusDisabilityHockeyIcon,
  SportsEnterovirusDisabilityHockey as EnterovirusDisabilityHockeyIcon,
  SportsParechovirusDisabilityHockey as ParechovirusDisabilityHockeyIcon,
  SportsAstrovirusDisabilityHockey as AstrovirusDisabilityHockeyIcon,
  SportsNorovirusDisabilityHockey as NorovirusDisabilityHockeyIcon,
  SportsRotavirusDisabilityHockey as RotavirusDisabilityHockeyIcon,
  SportsSapovirusDisabilityHockey as SapovirusDisabilityHockeyIcon,
  SportsAdenoAssociatedVirusDisabilityHockey as AdenoAssociatedVirusDisabilityHockeyIcon,
  SportsBKVDisabilityHockey as BKVDisabilityHockeyIcon,
  SportsJCVDisabilityHockey as JCVDisabilityHockeyIcon,
  SportsMCPyVDisabilityHockey as MCPyVDisabilityHockeyIcon,
  SportsTSPyVDisabilityHockey as TSPyVDisabilityHockeyIcon,
  SportsWUPyVDisabilityHockey as WUPyVDisabilityHockeyIcon,
  SportsKIPyVDisabilityHockey as KIPyVDisabilityHockeyIcon,
  SportsHPyV6DisabilityHockey as HPyV6DisabilityHockeyIcon,
  SportsHPyV7DisabilityHockey as HPyV7DisabilityHockeyIcon,
  SportsHPyV9DisabilityHockey as HPyV9DisabilityHockeyIcon,
  SportsHPyV10DisabilityHockey as HPyV10DisabilityHockeyIcon,
  SportsHPyV11DisabilityHockey as HPyV11DisabilityHockeyIcon,
  SportsHPyV12DisabilityHockey as HPyV12DisabilityHockeyIcon,
  SportsHPyV13DisabilityHockey as HPyV13DisabilityHockeyIcon,
  SportsHPyV14DisabilityHockey as HPyV14DisabilityHockeyIcon,
  SportsHPyV15DisabilityHockey as HPyV15DisabilityHockeyIcon,
  SportsHPyV16DisabilityHockey as HPyV16DisabilityHockeyIcon,
  SportsHPyV17DisabilityHockey as HPyV17DisabilityHockeyIcon,
  SportsHPyV18DisabilityHockey as HPyV18DisabilityHockeyIcon,
  SportsHPyV19DisabilityHockey as HPyV19DisabilityHockeyIcon,
  SportsHPyV20DisabilityHockey as HPyV20DisabilityHockeyIcon,
  SportsHPyV21DisabilityHockey as HPyV21DisabilityHockeyIcon,
  SportsHPyV22DisabilityHockey as HPyV22DisabilityHockeyIcon,
  SportsHPyV23DisabilityHockey as HPyV23DisabilityHockeyIcon,
  SportsHPyV24DisabilityHockey as HPyV24DisabilityHockeyIcon,
  SportsHPyV25DisabilityHockey as HPyV25DisabilityHockeyIcon,
  SportsHPyV26DisabilityHockey as HPyV26DisabilityHockeyIcon,
  SportsHPyV27DisabilityHockey as HPyV27DisabilityHockeyIcon,
  SportsHPyV28DisabilityHockey as HPyV28DisabilityHockeyIcon,
  SportsHPyV29DisabilityHockey as HPyV29DisabilityHockeyIcon,
  SportsHPyV30DisabilityHockey as HPyV30DisabilityHockeyIcon,
  SportsHPyV31DisabilityHockey as HPyV31DisabilityHockeyIcon,
  SportsHPyV32DisabilityHockey as HPyV32DisabilityHockeyIcon,
  SportsHPyV33DisabilityHockey as HPyV33DisabilityHockeyIcon,
  SportsHPyV34DisabilityHockey as HPyV34DisabilityHockeyIcon,
  SportsHPyV35DisabilityHockey as HPyV35DisabilityHockeyIcon,
  SportsHPyV36DisabilityHockey as HPyV36DisabilityHockeyIcon,
  SportsHPyV37DisabilityHockey as HPyV37DisabilityHockeyIcon,
  SportsHPyV38DisabilityHockey as HPyV38DisabilityHockeyIcon,
  SportsHPyV39DisabilityHockey as HPyV39DisabilityHockeyIcon,
  SportsHPyV40DisabilityHockey as HPyV40DisabilityHockeyIcon,
  SportsHPyV41DisabilityHockey as HPyV41DisabilityHockeyIcon,
  SportsHPyV42DisabilityHockey as HPyV42DisabilityHockeyIcon,
  SportsHPyV43DisabilityHockey as HPyV43DisabilityHockeyIcon,
  SportsHPyV44DisabilityHockey as HPyV44DisabilityHockeyIcon,
  SportsHPyV45DisabilityHockey as HPyV45DisabilityHockeyIcon,
  SportsHPyV46DisabilityHockey as HPyV46DisabilityHockeyIcon,
  SportsHPyV47DisabilityHockey as HPyV47DisabilityHockeyIcon,
  SportsHPyV48DisabilityHockey as HPyV48DisabilityHockeyIcon,
  SportsHPyV49DisabilityHockey as HPyV49DisabilityHockeyIcon,
  SportsHPyV50DisabilityHockey as HPyV50DisabilityHockeyIcon,
  SportsHPyV51DisabilityHockey as HPyV51DisabilityHockeyIcon,
  SportsHPyV52DisabilityHockey as HPyV52DisabilityHockeyIcon,
  SportsHPyV53DisabilityHockey as HPyV53DisabilityHockeyIcon,
  SportsHPyV54DisabilityHockey as HPyV54DisabilityHockeyIcon,
  SportsHPyV55DisabilityHockey as HPyV55DisabilityHockeyIcon,
  SportsHPyV56DisabilityHockey as HPyV56DisabilityHockeyIcon,
  SportsHPyV57DisabilityHockey as HPyV57DisabilityHockeyIcon,
  SportsHPyV58DisabilityHockey as HPyV58DisabilityHockeyIcon,
  SportsHPyV59DisabilityHockey as HPyV59DisabilityHockeyIcon,
  SportsHPyV60DisabilityHockey as HPyV60DisabilityHockeyIcon,
  SportsHPyV61DisabilityHockey as HPyV61DisabilityHockeyIcon,
  SportsHPyV62DisabilityHockey as HPyV62DisabilityHockeyIcon,
  SportsHPyV63DisabilityHockey as HPyV63DisabilityHockeyIcon,
  SportsHPyV64DisabilityHockey as HPyV64DisabilityHockeyIcon,
  SportsHPyV65DisabilityHockey as HPyV65DisabilityHockeyIcon,
  SportsHPyV66DisabilityHockey as HPyV66DisabilityHockeyIcon,
  SportsHPyV67DisabilityHockey as HPyV67DisabilityHockeyIcon,
  SportsHPyV68DisabilityHockey as HPyV68DisabilityHockeyIcon,
  SportsHPyV69DisabilityHockey as HPyV69DisabilityHockeyIcon,
  SportsHPyV70DisabilityHockey as HPyV70DisabilityHockeyIcon,
  SportsHPyV71DisabilityHockey as HPyV71DisabilityHockeyIcon,
  SportsHPyV72DisabilityHockey as HPyV72DisabilityHockeyIcon,
  SportsHPyV73DisabilityHockey as HPyV73DisabilityHockeyIcon,
  SportsHPyV74DisabilityHockey as HPyV74DisabilityHockeyIcon,
  SportsHPyV75DisabilityHockey as HPyV75DisabilityHockeyIcon,
  SportsHPyV76DisabilityHockey as HPyV76DisabilityHockeyIcon,
  SportsHPyV77DisabilityHockey as HPyV77DisabilityHockeyIcon,
  SportsHPyV78DisabilityHockey as HPyV78DisabilityHockeyIcon,
  SportsHPyV79DisabilityHockey as HPyV79DisabilityHockeyIcon,
  SportsHPyV80DisabilityHockey as HPyV80DisabilityHockeyIcon,
  SportsHPyV81DisabilityHockey as HPyV81DisabilityHockeyIcon,
  SportsHPyV82DisabilityHockey as HPyV82DisabilityHockeyIcon,
  SportsHPyV83DisabilityHockey as HPyV83DisabilityHockeyIcon,
  SportsHPyV84DisabilityHockey as HPyV84DisabilityHockeyIcon,
  SportsHPyV85DisabilityHockey as HPyV85DisabilityHockeyIcon,
  SportsHPyV86DisabilityHockey as HPyV86DisabilityHockeyIcon,
  SportsHPyV87DisabilityHockey as HPyV87DisabilityHockeyIcon,
  SportsHPyV88DisabilityHockey as HPyV88DisabilityHockeyIcon,
  SportsHPyV89DisabilityHockey as HPyV89DisabilityHockeyIcon,
  SportsHPyV90DisabilityHockey as HPyV90DisabilityHockeyIcon,
  SportsHPyV91DisabilityHockey as HPyV91DisabilityHockeyIcon,
  SportsHPyV92DisabilityHockey as HPyV92DisabilityHockeyIcon,
  SportsHPyV93DisabilityHockey as HPyV93DisabilityHockeyIcon,
  SportsHPyV94DisabilityHockey as HPyV94DisabilityHockeyIcon,
  SportsHPyV95DisabilityHockey as HPyV95DisabilityHockeyIcon,
  SportsHPyV96DisabilityHockey as HPyV96DisabilityHockeyIcon,
  SportsHPyV97DisabilityHockey as HPyV97DisabilityHockeyIcon,
  SportsHPyV98DisabilityHockey as HPyV98DisabilityHockeyIcon,
  SportsHPyV99DisabilityHockey as HPyV99DisabilityHockeyIcon,
  SportsHPyV100DisabilityHockey as HPyV100DisabilityHockeyIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDeveloperDashboard, useDeveloperAnalytics } from '@/hooks/api/developer';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

interface DeveloperDashboardClientProps {}

const DeveloperDashboardClient: React.FC<DeveloperDashboardClientProps> = () => {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterDialog, setFilterDialog] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30',
    projectType: 'all'
  });

  const [quickActions, setQuickActions] = useState([
    { id: 1, title: 'Add Project', icon: <AddIcon />, action: () => router.push('/projects/add'), color: 'primary' },
    { id: 2, title: 'View Projects', icon: <HomeIcon />, action: () => router.push('/projects'), color: 'success' },
    { id: 3, title: 'Analytics', icon: <AnalyticsIcon />, action: () => router.push('/developer/analytics'), color: 'info' },
    { id: 4, title: 'Profile', icon: <EditIcon />, action: () => router.push('/developer/profile'), color: 'warning' }
  ]);

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalUnits: 0,
    totalViews: 0,
    totalInquiries: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    topPerformingProject: null,
    recentActivity: []
  });

  // Enhanced queries with real-time data
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard, isFetching: dashboardFetching } = useDeveloperDashboard(filters, {
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: analytics, isLoading: analyticsLoading, isFetching: analyticsFetching } = useDeveloperAnalytics({
    timeframe: filters.dateRange + 'd'
  }, {
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Calculate enhanced dashboard stats
  useEffect(() => {
    if (dashboardData && dashboardData.stats) {
      const { stats: dashboardStats, projects, inquiries } = dashboardData;
      
      setStats({
        totalProjects: dashboardStats?.totalProjects || 0,
        activeProjects: dashboardStats?.activeProjects || 0,
        totalUnits: dashboardStats?.totalUnits || 0,
        totalViews: dashboardStats?.totalViews || 0,
        totalInquiries: dashboardStats?.totalInquiries || 0,
        conversionRate: dashboardStats?.conversionRate || 0,
        avgResponseTime: dashboardStats?.avgResponseTime || 0,
        topPerformingProject: projects?.[0] || null,
        recentActivity: inquiries?.slice(0, 10) || []
      });
    }
  }, [dashboardData]);

  // Chart data preparation
  const viewsData = dashboardData?.projects?.map(project => ({
    name: project.name.substring(0, 15) + '...',
    views: project.views || 0,
    units: project.units || 0
  })) || [];

  const inquiryStatusData = dashboardData?.inquiries?.reduce((acc, inquiry) => {
    acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get monthly data from analytics API or use empty array
  const monthlyData = analytics?.monthlyData || [];

  const COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)', 'var(--color-info)'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getProjectTypeIcon = (type) => {
    switch (type) {
      case 'residential': return <ApartmentIcon />;
      case 'commercial': return <StoreIcon />;
      case 'luxury': return <VillaIcon />;
      case 'hotel': return <HotelIcon />;
      case 'school': return <SchoolIcon />;
      case 'hospital': return <HospitalIcon />;
      case 'shopping': return <ShoppingIcon />;
      default: return <HomeIcon />;
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-light)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px var(--color-primary-20)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                {trend}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (dashboardLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading developer dashboard...
        </Typography>
      </Box>
    );
  }

  if (dashboardError) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard Error
          </Typography>
          <Typography variant="body2" gutterBottom>
            {dashboardError?.message || 'Failed to load dashboard data'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Please check your internet connection and try again
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4} gap={2}>
          <Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ 
                color: 'var(--color-primary)'
              }}>
                Welcome back, {user?.name}! 🏗️
              </Typography>
              {(dashboardFetching || analyticsFetching) && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">
                    Updating...
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="h6" color="text.secondary">
              Here&apos;s your development project overview
            </Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/projects/add')}
              sx={{ 
                backgroundColor: 'var(--color-primary)',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  backgroundColor: 'var(--color-primary-hover)'
                }
              }}
            >
              Add Project
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetchDashboard()}
              disabled={dashboardFetching}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<HomeIcon />}
            color="var(--color-primary)"
            subtitle="Active & completed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={<ConstructionIcon />}
            color="var(--color-success)"
            subtitle="Currently in progress"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Units"
            value={stats.totalUnits}
            icon={<ApartmentIcon />}
            color="var(--color-info)"
            subtitle="Across all projects"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={<ViewsIcon />}
            color="var(--color-warning)"
            subtitle="Project page visits"
          />
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inquiries"
            value={stats.totalInquiries}
            icon={<PeopleIcon />}
            color="var(--color-secondary)"
            subtitle="Total inquiries received"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={<TrendingUpIcon />}
            color="var(--color-success)"
            subtitle="Views to inquiries"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Response Time"
            value={`${stats.avgResponseTime}h`}
            icon={<CalendarIcon />}
            color="var(--color-info)"
            subtitle="Response to inquiries"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Top Project"
            value={stats.topPerformingProject?.name?.substring(0, 15) + '...' || 'N/A'}
            icon={<TrendingUpIcon />}
            color="var(--color-primary)"
            subtitle="Highest performing"
          />
        </Grid>
      </Grid>

      {/* Charts and Analytics */}
      <Grid container spacing={3} mb={4}>
        {/* Project Views Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400, background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Views Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="views" stroke="var(--color-primary)" fill="var(--color-primary-20)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inquiry Status Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400, background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inquiry Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(inquiryStatusData).map(([status, count]) => ({ name: status, value: count }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(inquiryStatusData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Projects and Activity */}
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Projects
                </Typography>
                <Button size="small" onClick={() => router.push('/projects')}>
                  View All
                </Button>
              </Box>
              <List>
                {(dashboardData?.projects || []).slice(0, 5).map((project, index) => (
                  <ListItem key={project.id || index} divider>
                    <ListItemAvatar>
                      <Avatar
                        src={typeof project.images?.[0] === 'string' 
                          ? project.images[0] 
                          : project.images?.[0]?.url || ''}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      >
                        {getProjectTypeIcon(project.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={project.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {typeof project.location === 'string' 
                              ? project.location 
                              : `${project.location?.city || ''}, ${project.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '')}
                          </Typography>
                          <Box display="flex" gap={1} mt={1}>
                            <Chip 
                              label={project.status} 
                              size="small" 
                              color={getStatusColor(project.status)}
                            />
                            <Chip 
                              label={`${project.units || 0} units`} 
                              size="small" 
                              variant="outlined"
                            />
                            <Chip 
                              label={`${project.views || 0} views`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => router.push(`/projects/${project.id}`)}>
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {(stats.recentActivity || []).slice(0, 5).map((activity, index) => (
                  <ListItem key={index} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'var(--color-primary)' }}>
                        <PeopleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message || 'New inquiry received'}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeveloperDashboardClient;
