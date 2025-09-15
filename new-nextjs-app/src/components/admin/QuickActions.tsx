"use client";
import React from 'react';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export type QuickActionItem = {
  id: number;
  title: string;
  icon: React.ReactNode;
  action: () => void;
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
};

type QuickActionsProps = {
  actions: QuickActionItem[];
};

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <Card sx={{ mb: 4, background: 'var(--color-bg-secondary)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={6} sm={4} md={2} key={action.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={action.action}
                  sx={{
                    height: 80,
                    flexDirection: 'column',
                    gap: 1,
                    borderColor: `${action.color}.main`,
                    color: `${action.color}.main`,
                    '&:hover': {
                      backgroundColor: `${action.color}.main`,
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${action.color}40`
                    }
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {action.title}
                  </Typography>
                </Button>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;

