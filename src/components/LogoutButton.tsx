import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const LogoutButton = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    // User will be automatically redirected to /login by ProtectedRoute
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
  Sign Out ({user?.email})
</Button>
  )
}

export default LogoutButton
