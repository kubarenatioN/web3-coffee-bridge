import { Box } from '@radix-ui/themes'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <Box px="2">
      <Outlet />
    </Box>
  )
}

export default Layout
