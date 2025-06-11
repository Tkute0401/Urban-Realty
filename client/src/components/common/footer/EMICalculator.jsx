import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(8000000);
  const [loanTenure, setLoanTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(8.15);
  const [propertyFinalized, setPropertyFinalized] = useState('');

  // Calculate EMI using standard formula
  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  // Calculate total interest
  const calculateTotalInterest = () => {
    const emi = calculateEMI();
    const totalPayment = emi * loanTenure * 12;
    return totalPayment - loanAmount;
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
      const remainder = num % 10000000;
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
      const remainder = num % 100000;
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
      const remainder = num % 1000;
      let result = convertHundreds(thousands) + "Thousand ";
      if (remainder > 0) {
        result += convertHundreds(remainder);
      }
      return result.trim() + " Only";
    } else {
      return convertHundreds(num).trim() + " Only";
    }
  };

  const emi = calculateEMI();
  const totalInterest = calculateTotalInterest();
  
  // Calculate percentages for donut chart
  const principalPercentage = (loanAmount / (loanAmount + totalInterest)) * 100;
  const interestPercentage = (totalInterest / (loanAmount + totalInterest)) * 100;

  return (
    <div className="min-h-screen bg-[#08171A] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Calculator */}
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
                  <select
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                    className="w-full p-3 bg-[#0c2227] border border-[#78CADC]/30 rounded-md text-white appearance-none pr-10 focus:border-[#78CADC] focus:outline-none"
                  >
                    {Array.from({length: 30}, (_, i) => i + 1).map(year => (
                      <option key={year} value={year}>{year} yrs</option>
                    ))}
                  </select>
                  <ExpandMoreIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
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

            {/* Property Finalized */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-3">Have you finalized your property?</label>
              <div className="flex gap-4">
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    name="property"
                    value="yes"
                    checked={propertyFinalized === 'yes'}
                    onChange={(e) => setPropertyFinalized(e.target.value)}
                    className="mr-2 accent-[#78CADC]"
                  />
                  Yes
                </label>
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    name="property"
                    value="no"
                    checked={propertyFinalized === 'no'}
                    onChange={(e) => setPropertyFinalized(e.target.value)}
                    className="mr-2 accent-[#78CADC]"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Calculate Button */}
            <button className="w-full bg-[#78CADC] hover:bg-[#78CADC]/90 text-[#08171A] font-semibold py-3 px-6 rounded-lg transition-colors">
              Calculate EMI
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {/* EMI Result */}
            <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6">
              <div className="text-center mb-6">
                <p className="text-gray-300 text-lg mb-2">Your Monthly EMI Amount</p>
                <p className="text-3xl font-bold text-[#78CADC]">{formatCurrency(emi)}</p>
              </div>

              {/* Donut Chart */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="8"
                    />
                    {/* Principal amount arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#78CADC"
                      strokeWidth="8"
                      strokeDasharray={`${(principalPercentage / 100) * 251.33} 251.33`}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-in-out"
                    />
                    {/* Interest amount arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="8"
                      strokeDasharray={`${(interestPercentage / 100) * 251.33} 251.33`}
                      strokeDashoffset={`-${(principalPercentage / 100) * 251.33}`}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-in-out"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Total</div>
                      <div className="text-sm font-bold text-white">
                        {formatIndianNumber(loanAmount + totalInterest)}
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
                  <span className="font-semibold text-white">{formatIndianNumber(loanAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-3"></div>
                    <span className="text-gray-300">Interest Amount</span>
                  </div>
                  <span className="font-semibold text-white">{formatIndianNumber(totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* Loan Summary */}
            <div className="bg-[#08171A] border border-[#78CADC] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#78CADC] mb-4">Loan Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Monthly EMI</span>
                  <span className="font-semibold text-[#78CADC]">{formatCurrency(emi)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Principal Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(loanAmount)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Total Interest</span>
                  <span className="font-semibold text-white">{formatCurrency(totalInterest)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#0c2227] rounded-lg">
                  <span className="text-gray-300">Total Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(loanAmount + totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-[#78CADC] hover:bg-[#78CADC]/90 text-[#08171A] font-semibold py-3 px-6 rounded-lg transition-colors">
                Apply for Loan
              </button>
              <button className="w-full border border-[#78CADC] text-[#78CADC] hover:bg-[#78CADC]/10 font-semibold py-3 px-6 rounded-lg transition-colors">
                Download EMI Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;