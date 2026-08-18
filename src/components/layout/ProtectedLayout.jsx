import Navbar from './Navbar'
import PageWrapper from './PageWrapper'

function ProtectedLayout({ children }) {
  return (
    <>
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
    </>
  )
}

export default ProtectedLayout
