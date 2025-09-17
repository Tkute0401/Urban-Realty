module.exports = { 
  extends: ['next/core-web-vitals'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['react-router-dom'],
            message: 'Use Next.js navigation instead of react-router-dom. Import from "next/link" and "next/navigation" instead.'
          }
        ]
      }
    ]
  }
}

