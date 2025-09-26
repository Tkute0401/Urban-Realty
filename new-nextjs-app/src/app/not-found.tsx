import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import { Home, Search, ArrowBack } from '@mui/icons-material'

export const metadata: Metadata = {
  title: 'Page Not Found | Squarefooot',
  description: 'The page you are looking for could not be found. Explore our properties, browse listings, or return to the homepage.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        {/* 404 Error */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', md: '8rem' },
            fontWeight: 'bold',
            color: 'var(--color-primary)',
            mb: 2,
          }}
        >
          404
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 'bold',
            mb: 2,
            color: 'var(--color-text-primary)',
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: '1.1rem',
            mb: 4,
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
          }}
        >
          Sorry, the page you are looking for could not be found. It might have been moved, deleted, or the URL was entered incorrectly.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            startIcon={<Home />}
            sx={{
              bgcolor: 'var(--color-primary)',
              color: 'white',
              px: 3,
              py: 1.5,
              '&:hover': {
                bgcolor: 'var(--color-primary-dark)',
              },
            }}
          >
            Go to Homepage
          </Button>

          <Button
            component={Link}
            href="/properties"
            variant="outlined"
            size="large"
            startIcon={<Search />}
            sx={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              px: 3,
              py: 1.5,
              '&:hover': {
                borderColor: 'var(--color-primary-dark)',
                bgcolor: 'var(--color-primary)',
                color: 'white',
              },
            }}
          >
            Browse Properties
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="text"
            size="large"
            startIcon={<ArrowBack />}
            sx={{
              color: 'var(--color-text-secondary)',
              px: 2,
              '&:hover': {
                bgcolor: 'var(--color-surface)',
              },
            }}
          >
            Go Back
          </Button>
        </Box>

        {/* Helpful Links */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid var(--color-border)' }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: 'var(--color-text-primary)',
              fontWeight: 'medium',
            }}
          >
            You might be looking for:
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center',
            }}
          >
            {[
              { label: 'Properties for Sale', href: '/properties?type=sale' },
              { label: 'Properties for Rent', href: '/properties?type=rent' },
              { label: 'About Us', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Help Center', href: '/help' },
            ].map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                variant="text"
                size="small"
                sx={{
                  color: 'var(--color-primary)',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}