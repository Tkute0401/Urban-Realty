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

  const convertOptions = [
    'Acre', 'Hectare', 'Square Gaj', 'Bigha', 'Killa', 'Lessa', 'Puri', 'Kanal', 
    'Biswa', 'Kacha Biswa', 'Dhur', 'Chatak', 'Square Yard', 'Square Mile', 'Ground',
    'Decimal', 'Marla', 'Square Inch', 'Katha', 'Guntha', 'Cent', 'Square Karam',
    'Murabba', 'Square Meter', 'Biswa Kacha', 'Gaj', 'Pura', 'Gajam', 'Ankanam',
    'Nali', 'Ares', 'Dismil', 'Square Feet', 'Square Centimeter', 'Square Kilometer'
  ];

  // Conversion rates (simplified - add more precise values as needed)
  const conversionRates = {
    'Square Meter': {
      'Square Feet': 10.764,
      'Acre': 0.000247,
      'Hectare': 0.0001,
      'Square Gaj': 1.196,
      'Bigha': 0.0004,
      'Square Yard': 1.196,
      'Square Mile': 0.0000003861,
      'Square Inch': 1550,
      'Square Centimeter': 10000,
      'Square Kilometer': 0.000001
    },
    'Square Feet': {
      'Square Meter': 0.0929,
      'Acre': 0.00002296,
      'Hectare': 0.00000929,
      'Square Gaj': 0.1111,
      'Square Yard': 0.1111,
      'Square Inch': 144,
      'Square Centimeter': 929.03
    },
    'Acre': {
      'Square Meter': 4046.86,
      'Square Feet': 43560,
      'Hectare': 0.4047,
      'Square Gaj': 4840,
      'Bigha': 1.6
    },
    'Hectare': {
      'Square Meter': 10000,
      'Square Feet': 107639,
      'Acre': 2.471,
      'Square Kilometer': 0.01
    }
    // Add more conversion rates as needed
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
          {/* About Home Loan EMI */}
          {/* <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#78CADC] mb-2">About Home EMI Calculator</h2>
              <p className="text-gray-300 mb-2 sm:mb-4 max-w-xs sm:max-w-md md:max-w-lg mx-auto text-xs sm:text-lg md:text-base">
                  Easily plan your home loan with our Home Loan EMI Calculator. Whether you're a first-time homebuyer or refinancing your mortgage, this tool helps you estimate your monthly EMI (Equated Monthly Installment) based on the loan amount, interest rate, and loan tenure. Just enter the values, and the calculator will instantly show your monthly repayment amount, helping you make informed financial decisions and manage your budget effectively.
                </p>
            </div> */}
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
      </div>
    </div>
  );
};

export default EMICalculator;