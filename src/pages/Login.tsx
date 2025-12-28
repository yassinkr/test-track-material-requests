import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
 

const baseSchema = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}

const signInSchema = z.object(baseSchema)

const signUpSchema = z.object({
  ...baseSchema,
  fullName: z.string().min(2, 'Full name is required'),
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

type AuthMode = 'signin' | 'signup'
 

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [loading, setLoading] = useState(false)

  const form = useForm<SignUpForm>({
    resolver: zodResolver(mode === 'signup' ? signUpSchema : signInSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  })

  /* Reset form when switching mode */
  useEffect(() => {
    form.reset()
  }, [mode, form])

  const onSubmit = async (values: SignUpForm) => {
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(values.email, values.password, values.fullName)
        toast({
          title: 'Account created',
          description: 'Check your email to confirm your account.',
        })
      } else {
        await signIn(values.email, values.password)
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        })
        navigate('/material-requests')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Sign in to your account'
              : 'Create a new account'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...form.register('fullName')}
                  placeholder="John Doe"
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.fullName?.message}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="you@example.com"
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.email?.message}
              </p>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                placeholder="••••••••"
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.password?.message}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? 'Loading...'
                : mode === 'signin'
                ? 'Sign In'
                : 'Sign Up'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setMode(mode === 'signin' ? 'signup' : 'signin')
              }
              className="w-full"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
