import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Box, Container, Typography } from '@mui/material'
import NotFoundClient from './NotFoundClient'

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
        <NotFoundClient />
      </Box>
    </Container>
  )
}