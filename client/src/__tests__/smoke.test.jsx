import { render } from '@testing-library/react'
import React from 'react'

describe('Client smoke', () => {
  it('renders a simple element', () => {
    const { getByText } = render(<div>Urban Realty</div>)
    expect(getByText('Urban Realty')).toBeInTheDocument()
  })
})
