import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from "react";
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EMICalculator = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user, login, error: authError } = useAuth();
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(8000000);
  const [loanTenure, setLoanTenure] = useState(15);
  const [interestRate, setInterestRate] = useState(8.15);
  const [showTenureDropdown, setShowTenureDropdown] = useState(false);
  const tenureOptions = [5, 10, 15, 20, 25, 30];
  
  // Converter states
  const [showFromUnitDropdown, setShowFromUnitDropdown] = useState(false);
  const [showToUnitDropdown, setShowToUnitDropdown] = useState(false);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [calculatedValues, setCalculatedValues] = useState(null);
  const [hasCalculatedWithChanges, setHasCalculatedWithChanges] = useState(false);

  // Default values
  const defaultLoanAmount = 8000000;
  const defaultLoanTenure = 15;
  const defaultInterestRate = 8.15;

  // Converter state and options
  const [converterState, setConverterState] = useState({
    fromUnit: 'Square Meter',
    toUnit: 'Square Feet',
    fromValue: 1,
    toValue: 10.764
  });

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const calculateTotalInterest = () => {
    const emi = calculateEMI();
    const totalPayment = emi * loanTenure * 12;
    return totalPayment - loanAmount;
  };

  const unitInformation = {
  "Acre": "An acre is a widely recognized unit of area used in the imperial and US customary systems. Commonly used in the United States, the UK, and India, one acre equals 43,560 square feet or approximately 4,047 square meters. It is often used in land deals and agricultural planning..",
  "Hectare": "The hectare is a metric unit of area used worldwide, especially in land measurement. One hectare equals 10,000 square meters or approximately 2.471 acres. It is a standard unit for measuring plots, farmland, and forests in many countries.",
  "Square Gaj": "Square Gaj, also known as Square Yard, is a traditional Indian unit of area measurement. Common in real estate, particularly in northern India, one Square Gaj is equal to 9 square feet. It is often used for small land parcels and residential plots.",
  "Bigha": "The Bigha is a traditional unit of land measurement used extensively across northern and eastern India. Its value varies significantly by region. For example, in Uttar Pradesh one Bigha is about ~27,000 ft², while in Assam it's around ~14,400 ft². It is commonly used for agricultural land.",
  "Killa": "Killa is a regional unit of area primarily used in Punjab and Haryana. It is equivalent to one acre or about 4,047 square meters. This unit is often used in agricultural and rural land measurement in northern India.",
  "Lessa": "Lessa is a land measurement unit used primarily in Assam. One Lessa equals 144 square feet. It is typically used to measure small plots or subdivided land portions",
  "Puri": "Puri is a localized unit of land area found in certain Indian regions. Its value can vary by location, and it is generally used in traditional landholding references.",
  "Kanal": "A Kanal is a traditional land measurement unit used in northern India and Pakistan. It is equal to 20 Marla or approximately 5,445 square feet. Kanal is commonly used in real estate and agricultural transactions.",
  "Biswa": "Biswa is a traditional unit of area used in northern India, usually as a subdivision of Bigha. The exact size varies by region, but generally, 20 Biswa make up one Bigha. It is often used in rural and agricultural land measurements..",
  "Kacha Biswa": "Kacha Biswa is a sub-unit of Biswa used in certain regions to denote a smaller or less standardized portion of land. Its value is slightly less than a regular Biswa and is used in informal or traditional land measurements.",
  "Dhur": "Dhur is a traditional land unit used in Bihar and Jharkhand. Its value varies, but on average, 1 Dhur equals approximately 39.14 square feet. It is typically used in rural areas for measuring small plots of land.",
  "Chatak": "Chatak is a land measurement unit used in West Bengal. One Chatak is equal to approximately 45 square feet or 4.18 square meters. It is a relatively small unit used for individual plots and small landholdings.",
  "Square Yard": "A Square Yard is a unit of area in the imperial system and is equal to 9 square feet or approximately 0.8361 square meters. It is widely used in real estate, especially in India, Pakistan, and the UK.",
  "Square Mile": "A Square Mile is a large unit of area in the imperial system, mainly used in the United States and the UK. One square mile equals 640 acres or about 2.59 square kilometers. It is often used to measure large tracts of land.",
  "Ground": "Ground is a unit of area commonly used in Tamil Nadu. One Ground equals 2,400 square feet. It is often used in real estate to describe the size of residential plots.",
  "Decimal": "Decimal is a land measurement unit used in eastern India and Bangladesh. One Decimal is equal to 1/100th of an acre or 435.6 square feet. It is commonly used in rural land measurement.",
  "Marla": "The Marla is a traditional unit of land area used in India and Pakistan. In India, 1 Marla equals 272.25 ft², while in Pakistan it is about 225 ft². It is widely used in real estate and property documents.",
  "Square Inch": "A Square Inch is a unit of area in the imperial system. One square inch equals 0.00064516 square meters or 6.4516 square centimeters. It is used for measuring small surfaces like screens or paper.",
  "Katha": "Katha, also spelled Kattha, is a traditional unit of land measurement used in Bihar, West Bengal, and Assam. It varies regionally, with values ranging from 600 to 2,800 ft². It is widely used in agricultural and rural land records.",
  "Guntha": "Guntha is a traditional unit used in Maharashtra and Andhra Pradesh. One Guntha equals 1,089 square feet or about 101.17 square meters. It is commonly used in rural and agricultural contexts.",
  // NEED TO ADD MORE INFORMATION ABOUT THE BELOW "UNITS".
  "Cent": "South Indian unit. 1 Cent = 1/100 of an acre = 435.6 square feet.",
  "Square Karam": "Also called Gaj; 1 Square Karam = 1 square Gaj = 9 ft².",
  "Murabba": "Used in Punjab; 1 Murabba = 25 acres = 100 Kanals.",
  "Square Meter": "Metric unit. 1 square meter = 10.7639 square feet.",
  "Biswa Kacha": "Alternative form of Biswa with slightly varied size.",
  "Gaj": "Linear unit; 1 Gaj ≈ 1 yard. Area-wise, 1 sq. Gaj = 9 ft².",
  "Pura": "Local measurement unit, size may vary regionally.",
  "Gajam": "Telugu equivalent of Square Yard; 1 Gajam = 1 square yard = 9 ft².",
  "Ankanam": "Used in Andhra Pradesh. 1 Ankanam = 72 square feet.",
  "Nali": "Uttarakhand unit of area, ~2,700 square feet.",
  "Ares": "Metric unit; 1 Are = 100 square meters.",
  "Dismil": "Same as Decimal; 1 Dismil = 435.6 square feet.",
  "Square Feet": "Area unit; 1 square foot = 144 square inches = 0.092903 m².",
  "Square Centimeter": "Metric unit; 1 cm² = 0.0001 m².",
  "Square Kilometer": "Metric unit; 1 km² = 1,000,000 m² or 247.1 acres."
};

  const convertOptions = [
    'Acre', 'Hectare', 'Square Gaj', 'Bigha', 'Killa', 'Lessa', 'Puri', 'Kanal', 
    'Biswa', 'Kacha Biswa', 'Dhur', 'Chatak', 'Square Yard', 'Square Mile', 'Ground',
    'Decimal', 'Marla', 'Square Inch', 'Katha', 'Guntha', 'Cent', 'Square Karam',
    'Murabba', 'Square Meter', 'Biswa Kacha', 'Gaj', 'Pura', 'Gajam', 'Ankanam',
    'Nali', 'Ares', 'Dismil', 'Square Feet', 'Square Centimeter', 'Square Kilometer'
  ];

  const [selectedUnitInfo, setSelectedUnitInfo] = useState({
    name: "Square Meter",
    description: unitInformation["Square Meter"]
  });

  

  // Conversion rates (simplified - add more precise values as needed)
  const conversionRates = {
    'Square Meter': {
      'Acre': 0.000247,
      'Hectare': 0.0001,
      'Square Gaj': 1.195999,
      'Bigha': 0.000395,
      'Killa': 0.000247,
      'Lessa': 0.158147,
      'Puri': 0.000098,
      'Kanal': 0.001976,
      'Biswa': 0.007907,
      'Kacha Biswa': 0.003953,
      'Dhur': 0.158147,
      'Chatak': 0.239198,
      'Square Yard': 1.195989,
      'Square Mile': 0,
      'Ground': 0.004484,
      'Decimal': 0.024712,
      'Marla': 0.0395361,
      'Square Inch': 1550,
      'Katha': 0.007907,
      'Guntha': 0.009884,
      'Cent': 0.024712,
      'Square Karam': 0.355831,
      'Murabba': 0.000009,
      'Square Meter': 1,
      'Biswa Kacha': 0.008,
      'Gaj': 1.207552,
      'Pura': 0.000099,
      'Gajam': 1.19596,
      'Ankanam': 0.149766,
      'Nali': 0.004983,
      'Ares': 0.01,
      'Dismil': 0.024712,
      'Square Feet': 10.76391,
      'Square Centimeter': 10000,
      'Square Kilometer': 0.000001
    },
    'Square Feet': {
      'Acre': 0.000022,
      'Hectare': 0.000009,
      'Square Gaj': 0.111112,
      'Bigha': 0.000036,
      'Killa': 0.000022,
      'Lessa': 0.014692,
      'Puri': 0.000009,
      'Kanal': 0.000183,
      'Biswa': 0.000734,
      'Kacha Biswa': 0.000367,
      'Dhur': 0.014692,
      'Chatak': 0.022222,
      'Square Yard': 0.111111,
      'Square Mile': 0,
      'Ground': 0.000416,
      'Decimal': 0.002295,
      'Marla': 0.003673,
      'Square Inch': 143.999711,
      'Katha': 0.000734,
      'Guntha': 0.000918,
      'Cent': 0.002295,
      'Square Karam': 0.033057,
      'Murabba': 0,
      'Square Meter': 0.092903,
      'Biswa Kacha': 0.000743,
      'Gaj': 0.112185,
      'Pura': 0.000009,
      'Gajam': 0.111108,
      'Ankanam': 0.013913,
      'Nali': 0.000462,
      'Ares': 0.000929,
      'Dismil': 0.002295,
      'Square Feet': 1,
      'Square Centimeter': 929.030399,
      'Square Kilometer': 0
    },
    'Acre': {
      'Acre': 1,
      'Hectare': 0.404685,
      'Square Gaj': 4840.04028,
      'Bigha': 1.6,
      'Killa': 1,
      'Lessa': 640,
      'Puri': 0.4,
      'Kanal': 8,
      'Biswa': 32,
      'Kacha Biswa': 16,
      'Dhur': 640,
      'Chatak': 968,
      'Square Yard': 4839.999528,
      'Square Mile': 0.001562,
      'Ground': 18.147338,
      'Decimal': 100.009183,
      'Marla': 160,
      'Square Inch': 6272627.455,
      'Katha': 32,
      'Guntha': 40,
      'Cent': 100.009183,
      'Square Karam': 1440,
      'Murabba': 0.04,
      'Square Meter': 4046.856421,
      'Biswa Kacha': 32.375032,
      'Gaj': 4886.797339,
      'Pura': 0.400717,
      'Gajam': 4839.884084,
      'Ankanam': 606.08504,
      'Nali': 25,
      'Ares': 40.467568,
      'Dismil': 100.008307,
      'Square Feet': 43560.00001,
      'Square Centimeter': 40468564.219999,
      'Square Kilometer': 0.004046
    },
    'Hectare': {
      'Acre': 2.471053,
      'Hectare': 1,
      'Square Gaj': 11960,
      'Bigha': 3.953686,
      'Killa': 2.471053,
      'Lessa': 1581.474441,
      'Puri': 0.988421,
      'Kanal': 19.76843,
      'Biswa': 79.073722,
      'Kacha Biswa': 39.536861,
      'Dhur': 1581.474441,
      'Chatak': 2391.980093,
      'Square Yard': 11959.899299,
      'Square Mile': 0.00386,
      'Ground': 44.843049,
      'Decimal': 247.128074,
      'Marla': 395.36861,
      'Square Inch': 15500000,
      'Katha': 79.073722,
      'Guntha': 98.842152,
      'Cent': 247.128074,
      'Square Karam': 3558.317493,
      'Murabba': 0.098842,
      'Square Meter': 10000,
      'Biswa Kacha': 80.000376,
      'Gaj': 12075.528532,
      'Pura': 0.990193,
      'Gajam': 11959.603458,
      'Ankanam': 1497.667426,
      'Nali': 50,
      'Ares': 100,
      'Dismil': 247.125691,
      'Square Feet': 107639.1042,
      'Square Centimeter': 100000000,
      'Square Kilometer': 0.01
    },
    'Square Gaj': {
      'Acre': 0.000206,
      'Hectare': 0.000083,
      'Square Gaj': 1,
      'Bigha': 0.00033,
      'Killa': 0.000206,
      'Lessa': 0.13223,
      'Puri': 0.000082,
      'Kanal': 0.001652,
      'Biswa': 0.006611,
      'Kacha Biswa': 0.003305,
      'Dhur': 0.13223,
      'Chatak': 0.199998,
      'Square Yard': 0.999991,
      'Square Mile': 0,
      'Ground': 0.003749,
      'Decimal': 0.020662,
      'Marla': 0.033057,
      'Square Inch': 1295.986621,
      'Katha': 0.006611,
      'Guntha': 0.008264,
      'Cent': 0.020662,
      'Square Karam': 0.297518,
      'Murabba': 0.000008,
      'Square Meter': 0.83612,
      'Biswa Kacha': 0.006625,
      'Gaj': 1,
      'Pura': 0.000082,
      'Gajam': 0.9904,
      'Ankanam': 0.124025,
      'Nali': 0.004166,
      'Ares': 0.008281,
      'Dismil': 0.020464,
      'Square Feet': 8.999925,
      'Square Centimeter': 8361.204013,
      'Square Kilometer': 0
    },
    'Bigha': {
      'Acre': 0.624999,
      'Hectare': 0.252928,
      'Square Gaj': 3025.025175,
      'Bigha': 1,
      'Killa': 0.624999,
      'Lessa': 400,
      'Puri': 0.25,
      'Kanal': 5,
      'Biswa': 20,
      'Kacha Biswa': 10,
      'Dhur': 400,
      'Chatak': 605,
      'Square Yard': 3024.999705,
      'Square Mile': 0.000976,
      'Ground': 11.342086,
      'Decimal': 62.505739,
      'Marla': 100,
      'Square Inch': 3920392.157999,
      'Katha': 20,
      'Guntha': 25,
      'Cent': 62.505739,
      'Square Karam': 900,
      'Murabba': 0.024999,
      'Square Meter': 2529.285263,
      'Biswa Kacha': 20.067023,
      'Gaj': 3028.984733,
      'Pura': 0.248376,
      'Gajam': 2999.906479,
      'Ankanam': 375.669831,
      'Nali': 14.285714,
      'Ares': 25.083661,
      'Dismil': 61.988172,
      'Square Feet': 27225,
      'Square Centimeter': 25292852.629999,
      'Square Kilometer': 0.002529
    },
    'Killa': {
      'Acre': 1,
      'Hectare': 0.404685,
      'Square Gaj': 4840.04028,
      'Bigha': 1.6,
      'Killa': 1,
      'Lessa': 640,
      'Puri': 0.4,
      'Kanal': 8,
      'Biswa': 32,
      'Kacha Biswa': 16,
      'Dhur': 640,
      'Chatak': 968,
      'Square Yard': 4839.999528,
      'Square Mile': 0.001562,
      'Ground': 18.147338,
      'Decimal': 100.009183,
      'Marla': 160,
      'Square Inch': 6272627.455,
      'Katha': 32,
      'Guntha': 40,
      'Cent': 100.009183,
      'Square Karam': 1440,
      'Murabba': 0.04,
      'Square Meter': 4046.856421,
      'Biswa Kacha': 32.375032,
      'Gaj': 4886.797339,
      'Pura': 0.400717,
      'Gajam': 4839.884084,
      'Ankanam': 606.08504,
      'Nali': 25,
      'Ares': 40.4686,
      'Dismil': 100.008307,
      'Square Feet': 43560.00001,
      'Square Centimeter': 40468564.219999,
      'Square Kilometer': 0.004046
    },
    'Lessa': {
      'Acre': 0.001562,
      'Hectare': 0.000632,
      'Square Gaj': 7.562562,
      'Bigha': 0.0025,
      'Killa': 0.001562,
      'Lessa': 1,
      'Puri': 0.000625,
      'Kanal': 0.0125,
      'Biswa': 0.05,
      'Kacha Biswa': 0.025,
      'Dhur': 1,
      'Chatak': 1.512499,
      'Square Yard': 7.562499,
      'Square Mile': 0.000002,
      'Ground': 0.028355,
      'Decimal': 0.156264,
      'Marla': 0.25,
      'Square Inch': 9800.980395,
      'Katha': 0.05,
      'Guntha': 0.0625,
      'Cent': 0.156264,
      'Square Karam': 2.25,
      'Murabba': 0.000062,
      'Square Meter': 6.323213,
      'Biswa Kacha': 0.050576,
      'Gaj': 7.634176,
      'Pura': 0.000626,
      'Gajam': 7.560888,
      'Ankanam': 0.946828,
      'Nali': 0.031505,
      'Ares': 0.06322,
      'Dismil': 0.156233,
      'Square Feet': 68.0625,
      'Square Centimeter': 63232.131589,
      'Square Kilometer': 0.000006
    },
  };

  const handleConverterChange = (e) => {
    const { name, value } = e.target;
    setConverterState(prev => {
      const newState = { ...prev, [name]: value };
      
      // Recalculate when fromUnit, toUnit, or fromValue changes
      if (name === 'fromUnit' || name === 'toUnit' || name === 'fromValue') {
        const rate = conversionRates[newState.fromUnit]?.[newState.toUnit] || 1;
        newState.toValue = parseFloat((newState.fromValue * rate).toFixed(6));
      }
      
      return newState;
    });
  };

  const selectFromUnit = (unit) => {
    setConverterState(prev => {
      const newState = { ...prev, fromUnit: unit };
      const rate = conversionRates[unit]?.[newState.toUnit] || 1;
      newState.toValue = parseFloat((newState.fromValue * rate).toFixed(6));
      return newState;
    });
    setShowFromUnitDropdown(false);
    
    // Update the selected unit information
    setSelectedUnitInfo({
      name: unit,
      description: unitInformation[unit] || "No information available for this unit."
    });
  };

  const selectToUnit = (unit) => {
    setConverterState(prev => {
      const newState = { ...prev, toUnit: unit };
      const rate = conversionRates[newState.fromUnit]?.[unit] || 1;
      newState.toValue = parseFloat((newState.fromValue * rate).toFixed(6));
      return newState;
    });
    setShowToUnitDropdown(false);
  };

  // Check if current values are different from default
  const hasChangedFromDefault = () => {
    return loanAmount !== defaultLoanAmount || 
           loanTenure !== defaultLoanTenure || 
           interestRate !== defaultInterestRate;
  };

  // Calculate default values for initial display
  const getDefaultCalculatedValues = () => {
    const emi = calculateEMI(defaultLoanAmount, defaultLoanTenure, defaultInterestRate);
    const totalInterest = calculateTotalInterest(defaultLoanAmount, defaultLoanTenure, defaultInterestRate);
    return {
      emi,
      totalInterest,
      principalPercentage: (defaultLoanAmount / (defaultLoanAmount + totalInterest)) * 100,
      interestPercentage: (totalInterest / (defaultLoanAmount + totalInterest)) * 100,
      loanAmount: defaultLoanAmount
    };
  };

  const handleCalculate = () => {
    // If user is not logged in and values have changed from default
    if (!user && hasChangedFromDefault()) {
      setShowLoginPrompt(true);
      setHasCalculatedWithChanges(true);
      return;
    }
    
    const emi = calculateEMI();
    const totalInterest = calculateTotalInterest();
    setCalculatedValues({
      emi,
      totalInterest,
      principalPercentage: (loanAmount / (loanAmount + totalInterest)) * 100,
      interestPercentage: (totalInterest / (loanAmount + totalInterest)) * 100,
      loanAmount: loanAmount
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password });
      if (result.success) {
        setShowLoginPrompt(false);
        setLoginError('');
        setHasCalculatedWithChanges(false);
        // Auto-calculate after successful login
        handleCalculate();
      }
    } catch (err) {
      setLoginError(authError || 'Login failed. Please try again.');
    }
  };

  // Format currency in Indian format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format large numbers in Indian notation
  const formatIndianNumber = (num) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    return `₹${num}`;
  };

  // Convert number to words
  const numberToWords = (num) => {
  if (!num || num === 0) return "Zero Only";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  const convertHundreds = (n) => {
    let result = "";
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + " ";
      return result;
    }
    if (n > 0) {
      result += ones[n] + " ";
    }
    return result;
  };
  
  if (num >= 10000000) { // Crores
    const crores = Math.floor(num / 10000000);
    let remainder = num % 10000000;
    let result = convertHundreds(crores) + "Crore ";
    if (remainder >= 100000) {
      const lakhs = Math.floor(remainder / 100000);
      result += convertHundreds(lakhs) + "Lakh ";
      remainder = remainder % 100000;
    }
    if (remainder >= 1000) {
      const thousands = Math.floor(remainder / 1000);
      result += convertHundreds(thousands) + "Thousand ";
      remainder = remainder % 1000;
    }
    if (remainder > 0) {
      result += convertHundreds(remainder);
    }
    return result.trim() + " Only";
  } else if (num >= 100000) { // Lakhs
    const lakhs = Math.floor(num / 100000);
    let remainder = num % 100000;
    let result = convertHundreds(lakhs) + "Lakh ";
    if (remainder >= 1000) {
      const thousands = Math.floor(remainder / 1000);
      result += convertHundreds(thousands) + "Thousand ";
      remainder = remainder % 1000;
    }
    if (remainder > 0) {
      result += convertHundreds(remainder);
    }
    return result.trim() + " Only";
  } else if (num >= 1000) { // Thousands
    const thousands = Math.floor(num / 1000);
    let remainder = num % 1000;
    let result = convertHundreds(thousands) + "Thousand ";
    if (remainder > 0) {
      result += convertHundreds(remainder);
    }
    return result.trim() + " Only";
  } else {
    return convertHundreds(num).trim() + " Only";
  }
};

  // Determine what values to display
  const displayValues = calculatedValues || getDefaultCalculatedValues();
  const shouldBlurResults = !user && hasCalculatedWithChanges;

  return (
    <div className="min-h-screen bg-[#08171A] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#0c2227] border border-[#78CADC] rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-[#78CADC] mb-4">Login Required</h3>
              <p className="text-gray-300 mb-6">
                Please login to calculate EMI with your custom values and view detailed charts.
              </p>      
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#08171A] border border-[#78CADC]/30 rounded-md text-white placeholder-gray-400 focus:border-[#78CADC] focus:outline-none"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-[#08171A] border border-[#78CADC]/30 rounded-md text-white placeholder-gray-400 focus:border-[#78CADC] focus:outline-none"
                    required
                  />
                </div>
                
                {loginError && (
                  <div className="text-red-400 text-sm mb-4">{loginError}</div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginPrompt(false);
                      setLoginError('');
                    }}
                    className="px-4 py-2 border border-[#78CADC] text-[#78CADC] rounded-lg hover:bg-[#78CADC]/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#78CADC] text-[#08171A] font-semibold rounded-lg hover:bg-[#78CADC]/90"
                  >
                    Login
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => navigate('/register')}
                    className="text-[#78CADC] hover:underline"
                  >
                    Register
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Calculator (always visible) */}
          <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#78CADC] mb-2">EMI Calculator</h2>
            </div>

            {/* Loan Amount */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">Loan Amount</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                className="w-full p-3 bg-[#0c2227] border border-[#78CADC]/30 rounded-md text-white placeholder-gray-400 focus:border-[#78CADC] focus:outline-none"
                placeholder="Enter loan amount"
              />
              <div className="text-xs text-gray-400 mt-1 italic">
                {numberToWords(loanAmount)}
              </div>
            </div>

            {/* Loan Tenure and Interest Rate */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Loan Tenure</label>
                <div className="relative">
                  <div 
                    className="w-full p-3 bg-[#0c2227] border border-[#78CADC]/30 rounded-md text-white placeholder-gray-400 focus:border-[#78CADC] focus:outline-none cursor-pointer flex justify-between items-center"
                    onClick={() => setShowTenureDropdown(!showTenureDropdown)}
                  >
                    <span>{loanTenure} yrs</span>
                    <ExpandMoreIcon className={`w-5 h-5 text-gray-400 transition-transform ${showTenureDropdown ? 'transform rotate-180' : ''}`} />
                  </div>
                  {showTenureDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-[#0c2227] border border-[#78CADC]/30 rounded-md shadow-lg">
                      {tenureOptions.map((option) => (
                        <div
                          key={option}
                          className="px-4 py-2 text-white hover:bg-[#78CADC]/10 cursor-pointer"
                          onClick={() => {
                            setLoanTenure(option);
                            setShowTenureDropdown(false);
                          }}
                        >
                          {option} yrs
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Interest Rate % (p.a.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 bg-[#0c2227] border border-[#78CADC]/30 rounded-md text-white placeholder-gray-400 focus:border-[#78CADC] focus:outline-none"
                  placeholder="8.15"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button 
              onClick={handleCalculate}
              className="w-full bg-[#78CADC] hover:bg-[#78CADC]/90 text-[#08171A] font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Calculate EMI
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className={`space-y-6 relative ${shouldBlurResults ? 'filter blur-sm' : ''}`}>
            {/* Overlay when not logged in but tried to calculate with changes */}
            {shouldBlurResults && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-30 z-10 flex items-center justify-center cursor-pointer"
                onClick={() => setShowLoginPrompt(true)}
              >
                <div className="text-[#78CADC] font-semibold text-lg">
                  Login to view custom calculations
                </div>
              </div>
            )}

            {/* Default message for non-logged users */}
            {!user && !hasCalculatedWithChanges && (
              <div className="bg-[#08171A] border border-[#78CADC]/50 rounded-lg p-4 mb-4">
                <p className="text-[#78CADC] text-sm text-center">
                  Showing default calculation. Login to calculate with your custom values.
                </p>
              </div>
            )}

            {/* EMI Result - Always show (either default or calculated) */}
            <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6">
              <div className="text-center mb-6">
                <p className="text-gray-300 text-lg mb-2">Your Monthly EMI Amount</p>
                <p className="text-3xl font-bold text-[#78CADC]">{formatCurrency(displayValues.emi)}</p>
              </div>

              {/* Donut Chart */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#78CADC"
                      strokeWidth="8"
                      strokeDasharray={`${(displayValues.principalPercentage / 100) * 251.33} 251.33`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="8"
                      strokeDasharray={`${(displayValues.interestPercentage / 100) * 251.33} 251.33`}
                      strokeDashoffset={`-${(displayValues.principalPercentage / 100) * 251.33}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Total</div>
                      <div className="text-sm font-bold text-white">
                        {formatIndianNumber(displayValues.loanAmount + displayValues.totalInterest)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#78CADC] rounded-sm mr-3"></div>
                    <span className="text-gray-300">Principal Amount</span>
                  </div>
                  <span className="font-semibold text-white">{formatIndianNumber(displayValues.loanAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-3"></div>
                    <span className="text-gray-300">Interest Amount</span>
                  </div>
                  <span className="font-semibold text-white">{formatIndianNumber(displayValues.totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* Loan Summary */}
            <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#78CADC] mb-4">Loan Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Monthly EMI</span>
                  <span className="font-semibold text-[#78CADC]">{formatCurrency(displayValues.emi)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Principal Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(displayValues.loanAmount)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Total Interest</span>
                  <span className="font-semibold text-white">{formatCurrency(displayValues.totalInterest)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Total Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(displayValues.loanAmount + displayValues.totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                className="w-full bg-[#78CADC] hover:bg-[#78CADC]/90 text-[#08171A] font-semibold py-3 px-6 rounded-lg transition-colors"
                disabled={!user}
              >
                Apply for Loan
              </button>
              <button 
                className="w-full border border-[#78CADC] text-[#78CADC] hover:bg-[#78CADC]/10 font-semibold py-3 px-6 rounded-lg transition-colors"
                disabled={!user}
              >
                Download EMI Schedule
              </button>
            </div>
          </div>
        </div>
        {/* Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#78CADC] mb-4">About Home Loan EMI Calculator</h2>
            <p className="text-gray-300 mb-4">
              Easily plan your home loan with our Home Loan EMI Calculator. Whether you're a first-time homebuyer or refinancing your mortgage, this tool helps you estimate your monthly EMI (Equated Monthly Installment) based on the loan amount, interest rate, and loan tenure. Just enter the values, and the calculator will instantly show your monthly repayment amount, helping you make informed financial decisions and manage your budget effectively.
            </p>
            <p className="text-gray-300">
              Our calculator provides a detailed breakdown of your payment schedule, showing the principal and interest components of each EMI, the total interest payable over the loan tenure, and the total amount payable (principal + interest). You can adjust the loan parameters to see how different loan amounts, tenures, or interest rates affect your monthly payments.
            </p>
          </div>
          
          <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#78CADC] mb-4">What is a Home Loan?</h2>
            <p className="text-gray-300 mb-4">
              A home loan is a sum of money borrowed from a financial institution or bank to purchase or construct a house. The loan is repaid through Equated Monthly Installments (EMIs) over a predetermined period, which typically ranges from 5 to 30 years. The EMI consists of both the principal amount and the interest charged by the lender.
            </p>
            <p className="text-gray-300">
              Home loans are secured loans, meaning the property being purchased serves as collateral. Interest rates can be fixed or floating, and borrowers may be eligible for tax benefits on both the principal repayment and interest payments under various sections of the Income Tax Act. The loan amount is determined based on factors like the property value, borrower's income, credit score, and existing financial obligations.
            </p>
          </div>
        </div>
      {/* Unit Converter Section */}
        <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-[#78CADC] mb-4">Area Converter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* From Unit Dropdown */}
            <div className="relative">
              <label className="block text-gray-300 text-sm mb-2">From Unit</label>
              <div 
                className="w-full p-3 bg-[#0c2227] border border-[#78CADC]/30 rounded-md text-white cursor-pointer flex justify-between items-center"
                onClick={() => setShowFromUnitDropdown(!showFromUnitDropdown)}
              >
                <span>{converterState.fromUnit}</span>
                <ExpandMoreIcon className={`w-5 h-5 text-gray-400 transition-transform ${showFromUnitDropdown ? 'transform rotate-180' : ''}`} />
              </div>
              {showFromUnitDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-[#0c2227] border border-[#78CADC]/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {convertOptions.map((unit) => (
                    <div
                      key={`from-${unit}`}
                      className="px-4 py-2 text-white hover:bg-[#78CADC]/10 cursor-pointer"
                      onClick={() => selectFromUnit(unit)}
                    >
                      {unit}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Value Input */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Value</label>
              <input
                type="number"
                name="fromValue"
                value={converterState.fromValue}
                onChange={handleConverterChange}
                className="w-full p-3 bg-[#0c2227] border border-[#78CADC]/30 rounded-md text-white focus:border-[#78CADC] focus:outline-none"
              />
            </div>
            
            {/* To Unit Dropdown */}
            <div className="relative">
              <label className="block text-gray-300 text-sm mb-2">To Unit</label>
              <div 
                className="w-full p-3 bg-[#0c2227] border border-[#78CADC]/30 rounded-md text-white cursor-pointer flex justify-between items-center"
                onClick={() => setShowToUnitDropdown(!showToUnitDropdown)}
              >
                <span>{converterState.toUnit}</span>
                <ExpandMoreIcon className={`w-5 h-5 text-gray-400 transition-transform ${showToUnitDropdown ? 'transform rotate-180' : ''}`} />
              </div>
              {showToUnitDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-[#0c2227] border border-[#78CADC]/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {convertOptions.map((unit) => (
                    <div
                      key={`to-${unit}`}
                      className="px-4 py-2 text-white hover:bg-[#78CADC]/10 cursor-pointer"
                      onClick={() => selectToUnit(unit)}
                    >
                      {unit}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Conversion Result */}
          <div className="bg-[#0c2227] p-4 rounded-lg">
            <p className="text-gray-300 text-center">
              {converterState.fromValue} {converterState.fromUnit} = {converterState.toValue} {converterState.toUnit}
            </p>
          </div>
        </div>

        {/* Information Sections */}
        <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-8 md:w-2/3">
          <h2 className="text-2xl font-bold text-[#78CADC] mb-4">About {selectedUnitInfo.name}</h2>
          <p className="text-gray-300">
            {selectedUnitInfo.description}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;