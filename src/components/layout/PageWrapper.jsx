import { Container } from '@mui/material'

function PageWrapper({ children, maxWidth = 'lg' }) {
  return (
    <Container maxWidth={maxWidth} sx={{ py: 4 }}>
      {children}
    </Container>
  )
}

export default PageWrapper
