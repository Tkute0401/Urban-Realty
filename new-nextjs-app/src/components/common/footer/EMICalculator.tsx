import React, { useState, useContext } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from "react";
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/contexts/ThemeProvider';
import { createThemeColors } from '@/lib/theme/colors';

const EMICalculator = () => {
  const { theme } = useContext(ThemeContext);
  const colors = createThemeColors(theme as 'light' | 'dark');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const { user, login, error: authError } = useAuth();
  const router = useRouter();
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

  // const unitInformation = {
  //   "Acre": "An acre is a widely recognized unit of area used in the imperial and US customary systems. Commonly used in the United States, the UK, and India, one acre equals 43,560 square feet or approximately 4,047 square meters. It is often used in land deals and agricultural planning.",
  //   "Hectare": "The hectare is a metric unit of area used worldwide, especially in land measurement. One hectare equals 10,000 square meters or approximately 2.471 acres. It is a standard unit for measuring plots, farmland, and forests in many countries.",
  //   "Square Gaj": "Square Gaj, also known as Square Yard, is a traditional Indian unit of area measurement. Common in real estate, particularly in northern India, one Square Gaj is equal to 9 square feet. It is often used for small land parcels and residential plots.",
  //   "Bigha": "The Bigha is a traditional unit of land measurement used extensively across northern and eastern India. Its value varies significantly by region. For example, in Uttar Pradesh one Bigha is about ~27,000 ft², while in Assam it's around ~14,400 ft². It is commonly used for agricultural land.",
  //   "Killa": "Killa is a regional unit of area primarily used in Punjab and Haryana. It is equivalent to one acre or about 4,047 square meters. This unit is often used in agricultural and rural land measurement in northern India.",
  //   "Lessa": "Lessa is a land measurement unit used primarily in Assam. One Lessa equals 144 square feet. It is typically used to measure small plots or subdivided land portions",
  //   "Puri": "Puri is a localized unit of land area found in certain Indian regions. Its value can vary by location, and it is generally used in traditional landholding references.",
  //   "Kanal": "A Kanal is a traditional land measurement unit used in northern India and Pakistan. It is equal to 20 Marla or approximately 5,445 square feet. Kanal is commonly used in real estate and agricultural transactions.",
  //   "Biswa": "Biswa is a traditional unit of area used in northern India, usually as a subdivision of Bigha. The exact size varies by region, but generally, 20 Biswa make up one Bigha. It is often used in rural and agricultural land measurements.",
  //   "Kacha Biswa": "Kacha Biswa is a sub-unit of Biswa used in certain regions to denote a smaller or less standardized portion of land. Its value is slightly less than a regular Biswa and is used in informal or traditional land measurements.",
  //   "Dhur": "Dhur is a traditional land unit used in Bihar and Jharkhand. Its value varies, but on average, 1 Dhur equals approximately 39.14 square feet. It is typically used in rural areas for measuring small plots of land.",
  //   "Chatak": "Chatak is a land measurement unit used in West Bengal. One Chatak is equal to approximately 45 square feet or 4.18 square meters. It is a relatively small unit used for individual plots and small landholdings.",
  //   "Square Yard": "A Square Yard is a unit of area in the imperial system and is equal to 9 square feet or approximately 0.8361 square meters. It is widely used in real estate, especially in India, Pakistan, and the UK.",
  //   "Square Mile": "A Square Mile is a large unit of area in the imperial system, mainly used in the United States and the UK. One square mile equals 640 acres or about 2.59 square kilometers. It is often used to measure large tracts of land.",
  //   "Ground": "Ground is a unit of area commonly used in Tamil Nadu. One Ground equals 2,400 square feet. It is often used in real estate to describe the size of residential plots.",
  //   "Decimal": "Decimal is a land measurement unit used in eastern India and Bangladesh. One Decimal is equal to 1/100th of an acre or 435.6 square feet. It is commonly used in rural land measurement.",
  //   "Marla": "The Marla is a traditional unit of land area used in India and Pakistan. In India, 1 Marla equals 272.25 ft², while in Pakistan it is about 225 ft². It is widely used in real estate and property documents.",
  //   "Square Inch": "A Square Inch is a unit of area in the imperial system. One square inch equals 0.00064516 square meters or 6.4516 square centimeters. It is used for measuring small surfaces like screens or paper.",
  //   "Katha": "Katha, also spelled Kattha, is a traditional unit of land measurement used in Bihar, West Bengal, and Assam. It varies regionally, with values ranging from 600 to 2,800 ft². It is widely used in agricultural and rural land records.",
  //   "Guntha": "Guntha is a traditional unit used in Maharashtra and Andhra Pradesh. One Guntha equals 1,089 square feet or about 101.17 square meters. It is commonly used in rural and agricultural contexts.",
  //   "Cent": "South Indian unit. 1 Cent = 1/100 of an acre = 435.6 square feet.",
  //   "Square Karam": "Also called Gaj; 1 Square Karam = 1 square Gaj = 9 ft².",
  //   "Murabba": "Used in Punjab; 1 Murabba = 25 acres = 100 Kanals.",
  //   "Square Meter": "Metric unit. 1 square meter = 10.7639 square feet.",
  //   "Biswa Kacha": "Alternative form of Biswa with slightly varied size.",
  //   "Gaj": "Linear unit; 1 Gaj ≈ 1 yard. Area-wise, 1 sq. Gaj = 9 ft².",
  //   "Pura": "Local measurement unit, size may vary regionally.",
  //   "Gajam": "Telugu equivalent of Square Yard; 1 Gajam = 1 square yard = 9 ft².",
  //   "Ankanam": "Used in Andhra Pradesh. 1 Ankanam = 72 square feet.",
  //   "Nali": "Uttarakhand unit of area, ~2,700 square feet.",
  //   "Ares": "Metric unit; 1 Are = 100 square meters.",
  //   "Dismil": "Same as Decimal; 1 Dismil = 435.6 square feet.",
  //   "Square Feet": "Area unit; 1 square foot = 144 square inches = 0.092903 m².",
  //   "Square Centimeter": "Metric unit; 1 cm² = 0.0001 m².",
  //   "Square Kilometer": "Metric unit; 1 km² = 1,000,000 m² or 247.1 acres."
  // };

const unitData = {
  'Square Centimeter': {
    conversionRate: 1,
    description: "Metric unit; 1 cm² = 0.0001 m²."
  },
  'Square Meter': {
    conversionRate: 10000,
    description: "Metric unit. 1 square meter = 10.7639 square feet."
  },
  'Square Kilometer': {
    conversionRate: 10000000000,
    description: "Metric unit; 1 km² = 1,000,000 m² or 247.1 acres."
  },
  'Square Inch': {
    conversionRate: 6.4516,
    description: "A Square Inch is a unit of area in the imperial system. One square inch equals 0.00064516 square meters or 6.4516 square centimeters. It is used for measuring small surfaces like screens or paper."
  },
  'Square Feet': {
    conversionRate: 929.0304,
    description: "Area unit; 1 square foot = 144 square inches = 0.092903 m²."
  },
  'Square Yard': {
    conversionRate: 8361.2736,
    description: "A Square Yard is a unit of area in the imperial system and is equal to 9 square feet or approximately 0.8361 square meters. It is widely used in real estate, especially in India, Pakistan, and the UK."
  },
  'Square Mile': {
    conversionRate: 25899881103.36,
    description: "A Square Mile is a large unit of area in the imperial system, mainly used in the United States and the UK. One square mile equals 640 acres or about 2.59 square kilometers. It is often used to measure large tracts of land."
  },
  'Acre': {
    conversionRate: 40468564.224,
    description: "An acre is a widely recognized unit of area used in the imperial and US customary systems. Commonly used in the United States, the UK, and India, one acre equals 43,560 square feet or approximately 4,047 square meters. It is often used in land deals and agricultural planning."
  },
  'Hectare': {
    conversionRate: 100000000,
    description: "The hectare is a metric unit of area used worldwide, especially in land measurement. One hectare equals 10,000 square meters or approximately 2.471 acres. It is a standard unit for measuring plots, farmland, and forests in many countries."
  },

  // Updating from here...
  'Square Gaj': {
    conversionRate: 0.000119,
    description: ""
  },
  'Bigha': {
    conversionRate: 10117141.056,
    description: ""
  },
  'Killa': {
    conversionRate: 40468564.224,
    description: ""
  },
  'Lessa': {
    conversionRate: 0.000015,
    description: ""
  },
  'Puri': {
    conversionRate: 10117141.056,
    description: ""
  },
  'Kanal': {
    conversionRate: 5058570.528,
    description: ""
  },
  'Biswa': {
    conversionRate: 126464.2632,
    description: ""
  },
  'Kacha Biswa': {
    conversionRate: 63232.1316,
    description: ""
  },
  'Dhur': {
    conversionRate: 0.000015,
    description: ""
  },
  'Chatak': {
    conversionRate: 0.000023,
    description: ""
  },
  'Ground': {
    conversionRate: 222967.296,
    description: ""
  },
  'Decimal': {
    conversionRate: 0.000002,
    description: ""
  },
  'Marla': {
    conversionRate: 0.000003,
    description: ""
  },
  'Katha': {
    conversionRate: 126464.2632,
    description: ""
  },
  'Guntha': {
    conversionRate: 1011714.1056,
    description: ""
  },
  'Cent': {
    conversionRate: 0.000002,
    description: ""
  },
  'Square Karam': {
    conversionRate: 0.000035,
    description: ""
  },
  'Murabba': {
    conversionRate: 1011714105.6,
    description: ""
  },
  'Biswa Kacha': {
    conversionRate: 126464.2632,
    description: ""
  },
  'Gaj': {
    conversionRate: 0.00012,
    description: ""
  },
  'Pura': {
    conversionRate: 10117141.056,
    description: ""
  },
  'Gajam': {
    conversionRate: 0.000119,
    description: ""
  },
  'Ankanam': {
    conversionRate: 0.000014,
    description: ""
  },
  'Nali': {
    conversionRate: 200670.5664,
    description: ""
  },
  'Ares': {
    conversionRate: 0.000001,
    description: ""
  },
  'Dismil': {
    conversionRate: 0.000002,
    description: ""
  },
};

  const [selectedUnitInfo, setSelectedUnitInfo] = useState({
    name: "Square Meter",
    description: unitData["Square Meter"].description
});

  // Conversion rates to square centimeters (base unit)
  // const conversionRatesToCm = {
  //   'Square Centimeter': 1,
  //   'Square Meter': 10000,
  //   'Square Kilometer': 10000000000,
  //   'Square Inch': 6.4516,
  //   'Square Feet': 929.0304,
  //   'Square Yard': 8361.2736,
  //   'Square Mile': 25899881103.36,
  //   'Acre': 40468564.224,
  //   'Hectare': 100000000,
  //   'Square Gaj': 8361.2736,
  //   'Bigha': 25000000, // Approximate value (varies by region)
  //   'Killa': 40468564.224,
  //   'Lessa': 13378.03776,
  //   'Puri': 10000000, // Approximate value
  //   'Kanal': 5058570.528,
  //   'Biswa': 1250000, // Approximate value
  //   'Kacha Biswa': 625000, // Approximate value
  //   'Dhur': 13378.03776,
  //   'Chatak': 41806.368,
  //   'Ground': 222967.296,
  //   'Decimal': 40468.564224,
  //   'Marla': 252928.5264,
  //   'Katha': 66890.1888, // Approximate value
  //   'Guntha': 101171.41056,
  //   'Cent': 40468.564224,
  //   'Square Karam': 8361.2736,
  //   'Murabba': 1011714105.6,
  //   'Biswa Kacha': 1250000, // Approximate value
  //   'Gaj': 8361.2736,
  //   'Pura': 10000000, // Approximate value
  //   'Gajam': 8361.2736,
  //   'Ankanam': 66890.1888,
  //   'Nali': 250838.208,
  //   'Ares': 1000000,
  //   'Dismil': 40468.564224,
  // };

  const convertUnit = (fromUnit, toUnit, value) => {
  const inCm = value * unitData[fromUnit].conversionRate;
  return inCm / unitData[toUnit].conversionRate;
};

  const handleConverterChange = (e) => {
    const { name, value } = e.target;
    setConverterState(prev => {
      const newState = { ...prev, [name]: value };
      
      // Recalculate when fromUnit, toUnit, or fromValue changes
      if (name === 'fromUnit' || name === 'toUnit' || name === 'fromValue') {
        const convertedValue = convertUnit(newState.fromUnit, newState.toUnit, newState.fromValue);
        newState.toValue = parseFloat(convertedValue.toFixed(6));
      }
      
      return newState;
    });
  };

  const selectFromUnit = (unit) => {
  setConverterState(prev => {
    const convertedValue = convertUnit(unit, prev.toUnit, prev.fromValue);
    return {
      ...prev,
      fromUnit: unit,
      toValue: parseFloat(convertedValue.toFixed(6))
    };
  });
  setShowFromUnitDropdown(false);
  
  setSelectedUnitInfo({
    name: unit,
    description: unitData[unit].description
  });
};

  const selectToUnit = (unit) => {
    setConverterState(prev => {
      const convertedValue = convertUnit(prev.fromUnit, unit, prev.fromValue);
      return {
        ...prev,
        toUnit: unit,
        toValue: parseFloat(convertedValue.toFixed(6))
      };
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
    const emi = calculateEMI();
    const totalInterest = calculateTotalInterest();
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
    <div 
      className="min-h-screen p-4"
      style={{ backgroundColor: colors.bg.primary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              className="border rounded-lg p-6 max-w-md w-full"
              style={{ 
                backgroundColor: colors.bg.secondary,
                borderColor: colors.primary.main
              }}
            >
              <h3 
                className="text-xl font-bold mb-4"
                style={{ color: colors.primary.main }}
              >
                Login Required
              </h3>
              <p 
                className="mb-6"
                style={{ color: colors.text.secondary }}
              >
                Please login to calculate EMI with your custom values and view detailed charts.
              </p>      
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label 
                    className="block text-sm mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-md focus:outline-none"
                    style={{ 
                      backgroundColor: colors.bg.primary,
                      borderColor: `${colors.primary.main}50`,
                      color: colors.text.primary
                    }}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label 
                    className="block text-sm mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-md focus:outline-none"
                    style={{ 
                      backgroundColor: colors.bg.primary,
                      borderColor: `${colors.primary.main}50`,
                      color: colors.text.primary
                    }}
                    required
                  />
                </div>
                
                {loginError && (
                  <div 
                    className="text-sm mb-4"
                    style={{ color: colors.semantic.error }}
                  >
                    {loginError}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginPrompt(false);
                      setLoginError('');
                    }}
                    className="px-4 py-2 border rounded-lg"
                    style={{ 
                      borderColor: colors.primary.main,
                      color: colors.primary.main,
                      backgroundColor: 'transparent'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-semibold rounded-lg"
                    style={{ 
                      backgroundColor: colors.primary.main,
                      color: colors.primary.contrast
                    }}
                  >
                    Login
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p 
                  className="text-sm"
                  style={{ color: colors.text.muted }}
                >
                  Don&apos;t have an account?{' '}
                  <button 
                    onClick={() => router.push('/register')}
                    className="hover:underline"
                    style={{ color: colors.primary.main }}
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
          <div 
            className="border rounded-lg p-6"
            style={{ 
              backgroundColor: colors.bg.secondary,
              borderColor: colors.primary.main
            }}
          >
            <div className="mb-6">
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: colors.primary.main }}
              >
                EMI Calculator
              </h2>
            </div>

            {/* Loan Amount */}
            <div className="mb-6">
              <label 
                className="block text-sm mb-2"
                style={{ color: colors.text.secondary }}
              >
                Loan Amount
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                className="w-full p-3 rounded-md focus:outline-none"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
                placeholder="Enter loan amount"
              />
              <div 
                className="text-xs mt-1 italic"
                style={{ color: colors.text.muted }}
              >
                {numberToWords(loanAmount)}
              </div>
            </div>

            {/* Loan Tenure and Interest Rate */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Loan Tenure</label>
                <div className="relative">
                  <div 
                    className="w-full p-3 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md text-white placeholder-gray-400 focus:border-[color:var(--color-primary)] focus:outline-none cursor-pointer flex justify-between items-center"
                    onClick={() => setShowTenureDropdown(!showTenureDropdown)}
                  >
                    <span>{loanTenure} yrs</span>
                    <ExpandMoreIcon className={`w-5 h-5 text-gray-400 transition-transform ${showTenureDropdown ? 'transform rotate-180' : ''}`} />
                  </div>
                  {showTenureDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md shadow-lg">
                      {tenureOptions.map((option) => (
                        <div
                          key={option}
                          className="px-4 py-2 text-white hover:bg-[color:var(--color-primary)]/10 cursor-pointer"
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
                  className="w-full p-3 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md text-white placeholder-gray-400 focus:border-[color:var(--color-primary)] focus:outline-none"
                  placeholder="8.15"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button 
              onClick={handleCalculate}
              className="w-full font-semibold py-3 px-6 rounded-lg transition-colors"
              style={{ 
                backgroundColor: colors.primary.main,
                color: colors.primary.contrast
              }}
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
                <div className="text-[color:var(--color-primary)] font-semibold text-lg">
                  Login to view custom calculations
                </div>
              </div>
            )}

            {/* Default message for non-logged users */}
            {!user && !hasCalculatedWithChanges && (
              <div className="bg-[#08171A] border border-[color:var(--color-primary)]/50 rounded-lg p-4 mb-4">
                <p className="text-[color:var(--color-primary)] text-sm text-center">
                  Showing default calculation. Login to calculate with your custom values.
                </p>
              </div>
            )}

            {/* EMI Result - Always show (either default or calculated) */}
            <div className="bg-[#08171A] border border-[color:var(--color-primary)] rounded-lg p-6">
              <div className="text-center mb-6">
                <p className="text-gray-300 text-lg mb-2">Your Monthly EMI Amount</p>
                <p className="text-3xl font-bold text-[color:var(--color-primary)]">{formatCurrency(displayValues.emi)}</p>
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
                      stroke="var(--color-primary)"
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
                    <div className="w-4 h-4 bg-[color:var(--color-primary)] rounded-sm mr-3"></div>
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
            <div className="bg-[#08171A] border border-[color:var(--color-primary)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[color:var(--color-primary)] mb-4">Loan Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Monthly EMI</span>
                  <span className="font-semibold text-[color:var(--color-primary)]">{formatCurrency(displayValues.emi)}</span>
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
                className="w-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/90 text-[#08171A] font-semibold py-3 px-6 rounded-lg transition-colors"
                disabled={!user}
              >
                Apply for Loan
              </button>
              <button 
                className="w-full border border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 font-semibold py-3 px-6 rounded-lg transition-colors"
                disabled={!user}
              >
                Download EMI Schedule
              </button>
            </div>
          </div>
        </div>
        {/* Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-[#08171A] border border-[color:var(--color-primary)] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[color:var(--color-primary)] mb-4">About Home Loan EMI Calculator</h2>
            <p className="text-gray-300 mb-4">
              Easily plan your home loan with our Home Loan EMI Calculator. Whether you&apos;re a first-time homebuyer or refinancing your mortgage, this tool helps you estimate your monthly EMI (Equated Monthly Installment) based on the loan amount, interest rate, and loan tenure. Just enter the values, and the calculator will instantly show your monthly repayment amount, helping you make informed financial decisions and manage your budget effectively.
            </p>
            <p className="text-gray-300">
              Our calculator provides a detailed breakdown of your payment schedule, showing the principal and interest components of each EMI, the total interest payable over the loan tenure, and the total amount payable (principal + interest). You can adjust the loan parameters to see how different loan amounts, tenures, or interest rates affect your monthly payments.
            </p>
          </div>
          
          <div className="bg-[#08171A] border border-[color:var(--color-primary)] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[color:var(--color-primary)] mb-4">What is a Home Loan?</h2>
            <p className="text-gray-300 mb-4">
              A home loan is a sum of money borrowed from a financial institution or bank to purchase or construct a house. The loan is repaid through Equated Monthly Installments (EMIs) over a predetermined period, which typically ranges from 5 to 30 years. The EMI consists of both the principal amount and the interest charged by the lender.
            </p>
            <p className="text-gray-300">
              Home loans are secured loans, meaning the property being purchased serves as collateral. Interest rates can be fixed or floating, and borrowers may be eligible for tax benefits on both the principal repayment and interest payments under various sections of the Income Tax Act. The loan amount is determined based on factors like the property value, borrower&apos;s income, credit score, and existing financial obligations.
            </p>
          </div>
        </div>
      {/* Unit Converter Section */}
      <div className="bg-[#08171A] border border-[color:var(--color-primary)] rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-[color:var(--color-primary)] mb-4">Area Converter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* From Unit Dropdown */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">From Unit</label>
            <div 
              className="w-full p-3 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md text-white cursor-pointer flex justify-between items-center"
              onClick={() => setShowFromUnitDropdown(!showFromUnitDropdown)}
            >
              <span>{converterState.fromUnit}</span>
              <ExpandMoreIcon className={`w-5 h-5 text-gray-400 transition-transform ${showFromUnitDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showFromUnitDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {Object.keys(unitData).map((unit) => (
                  <div
                    key={`from-${unit}`}
                    className="px-4 py-2 text-white hover:bg-[color:var(--color-primary)]/10 cursor-pointer"
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
              className="w-full p-3 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md text-white focus:border-[color:var(--color-primary)] focus:outline-none"
            />
          </div>
          
          {/* To Unit Dropdown */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">To Unit</label>
            <div 
              className="w-full p-3 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md text-white cursor-pointer flex justify-between items-center"
              onClick={() => setShowToUnitDropdown(!showToUnitDropdown)}
            >
              <span>{converterState.toUnit}</span>
              <ExpandMoreIcon className={`w-5 h-5 text-gray-400 transition-transform ${showToUnitDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showToUnitDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-[#0c2227] border border-[color:var(--color-primary)]/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {Object.keys(unitData).map((unit) => (
                  <div
                    key={`to-${unit}`}
                    className="px-4 py-2 text-white hover:bg-[color:var(--color-primary)]/10 cursor-pointer"
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
        <div className="bg-[#08171A] border border-[color:var(--color-primary)] rounded-lg p-8 md:w-full">
          <h2 className="text-2xl font-bold text-[color:var(--color-primary)] mb-4">About {selectedUnitInfo.name}</h2>
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