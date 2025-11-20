'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider
} from '@mui/material';
import { Calculate, TrendingUp, AccountBalance } from '@mui/icons-material';
import { formatPrice } from '@/lib/utils/format';

interface EMICalculatorProps {
  propertyPrice?: number;
  onAffordabilityCheck?: (affordable: boolean, emi: number) => void;
}

interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  balance: number;
  emi: number;
}

const EMICalculator: React.FC<EMICalculatorProps> = ({
  propertyPrice = 0,
  onAffordabilityCheck
}) => {
  const [price, setPrice] = useState(propertyPrice || 5000000);
  const [downPayment, setDownPayment] = useState(20); // Percentage
  const [loanTenure, setLoanTenure] = useState(20); // Years
  const [interestRate, setInterestRate] = useState(8.5); // Annual percentage
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [showAmortization, setShowAmortization] = useState(false);

  // Calculate EMI
  const calculateEMI = () => {
    const principal = price * (1 - downPayment / 100);
    const monthlyRate = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;

    if (monthlyRate === 0) {
      return principal / numberOfMonths;
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    return emi;
  };

  // Calculate amortization schedule
  const calculateAmortization = (): AmortizationRow[] => {
    const principal = price * (1 - downPayment / 100);
    const monthlyRate = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;
    const emi = calculateEMI();

    const schedule: AmortizationRow[] = [];
    let balance = principal;

    for (let month = 1; month <= numberOfMonths; month++) {
      const interest = balance * monthlyRate;
      const principalPayment = emi - interest;
      balance -= principalPayment;

      schedule.push({
        month,
        principal: principalPayment,
        interest,
        balance: Math.max(0, balance),
        emi
      });
    }

    return schedule;
  };

  const emi = calculateEMI();
  const principal = price * (1 - downPayment / 100);
  const totalPayment = emi * loanTenure * 12;
  const totalInterest = totalPayment - principal;
  const downPaymentAmount = price * (downPayment / 100);

  // Affordability check (EMI should not exceed 40-50% of monthly income)
  const isAffordable = monthlyIncome > 0 && emi <= monthlyIncome * 0.5;
  const emiToIncomeRatio = monthlyIncome > 0 ? (emi / monthlyIncome) * 100 : 0;

  useEffect(() => {
    if (onAffordabilityCheck) {
      onAffordabilityCheck(isAffordable, emi);
    }
  }, [isAffordable, emi, onAffordabilityCheck]);

  const amortizationSchedule = showAmortization ? calculateAmortization() : [];

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', background: 'var(--color-surface)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Calculate sx={{ mr: 1, color: 'var(--color-primary)' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
          EMI Calculator
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Input Fields */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
            }}
            sx={{ mb: 2 }}
          />

          <Typography gutterBottom sx={{ mt: 2 }}>
            Down Payment: {downPayment}%
          </Typography>
          <Slider
            value={downPayment}
            onChange={(_, value) => setDownPayment(value as number)}
            min={10}
            max={50}
            step={5}
            marks={[
              { value: 10, label: '10%' },
              { value: 20, label: '20%' },
              { value: 30, label: '30%' },
              { value: 40, label: '40%' },
              { value: 50, label: '50%' }
            ]}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Down Payment Amount: {formatPrice(downPaymentAmount)}
          </Typography>

          <Typography gutterBottom sx={{ mt: 3 }}>
            Loan Tenure: {loanTenure} years
          </Typography>
          <Slider
            value={loanTenure}
            onChange={(_, value) => setLoanTenure(value as number)}
            min={5}
            max={30}
            step={1}
            marks={[
              { value: 5, label: '5Y' },
              { value: 10, label: '10Y' },
              { value: 15, label: '15Y' },
              { value: 20, label: '20Y' },
              { value: 25, label: '25Y' },
              { value: 30, label: '30Y' }
            ]}
            sx={{ mb: 2 }}
          />

          <Typography gutterBottom sx={{ mt: 3 }}>
            Interest Rate: {interestRate}% p.a.
          </Typography>
          <Slider
            value={interestRate}
            onChange={(_, value) => setInterestRate(value as number)}
            min={6}
            max={15}
            step={0.1}
            marks={[
              { value: 6, label: '6%' },
              { value: 8.5, label: '8.5%' },
              { value: 10, label: '10%' },
              { value: 12, label: '12%' },
              { value: 15, label: '15%' }
            ]}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Monthly Income (Optional)"
            type="number"
            value={monthlyIncome || ''}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
            }}
            sx={{ mt: 2 }}
            helperText="Enter your monthly income to check affordability"
          />
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Loan Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Loan Amount
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatPrice(principal)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Monthly EMI
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatPrice(emi)}
              </Typography>
            </Box>

            {monthlyIncome > 0 && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={isAffordable ? 'Affordable' : 'Not Affordable'}
                  color={isAffordable ? 'success' : 'error'}
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  EMI to Income Ratio: {emiToIncomeRatio.toFixed(1)}%
                  {emiToIncomeRatio > 50 && ' (Recommended: < 50%)'}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Interest Payable
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-error)' }}>
                {formatPrice(totalInterest)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Payment (Principal + Interest)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatPrice(totalPayment)}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowAmortization(!showAmortization)}
              sx={{ mt: 2 }}
            >
              {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Amortization Schedule */}
      {showAmortization && amortizationSchedule.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Amortization Schedule
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Principal</TableCell>
                  <TableCell align="right">Interest</TableCell>
                  <TableCell align="right">EMI</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {amortizationSchedule.slice(0, 60).map((row) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell align="right">{formatPrice(row.principal)}</TableCell>
                    <TableCell align="right">{formatPrice(row.interest)}</TableCell>
                    <TableCell align="right">{formatPrice(row.emi)}</TableCell>
                    <TableCell align="right">{formatPrice(row.balance)}</TableCell>
                  </TableRow>
                ))}
                {amortizationSchedule.length > 60 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        ... and {amortizationSchedule.length - 60} more months
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

export default EMICalculator;

