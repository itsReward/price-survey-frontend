import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { authService } from '@/services/auth'
import TypewriterText from '@/components/animations/TypewriterText'
import FadeIn from '@/components/animations/FadeIn'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const GOOGLE_CLIENT_ID = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string || ''

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{[key: string]: string}>({})

    const navigate = useNavigate()
    useLocation();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {}

        if (!formData.firstName.trim()) {
            newErrors['firstName'] = 'First name is required'
        }
        if (!formData.lastName.trim()) {
            newErrors['lastName'] = 'Last name is required'
        }
        if (!formData.email.trim()) {
            newErrors['email'] = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors['email'] = 'Invalid email format'
        }
        if (!formData.password) {
            newErrors['password'] = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors['password'] = 'Password must be at least 6 characters'
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors['confirmPassword'] = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        try {
            await authService.register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            })

            toast.success('Registration successful! Please wait for admin approval.')
            navigate('/login')
        } catch (error: any) {
            console.error('Registration error:', error)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Registration failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setIsLoading(true)

            // Decode the JWT token to get user info
            const token = credentialResponse.credential
            const decodedToken = JSON.parse(atob(token.split('.')[1]))

            await authService.googleAuth({
                token,
                email: decodedToken.email,
                firstName: decodedToken.given_name,
                lastName: decodedToken.family_name,
                picture: decodedToken.picture
            })

            toast.success('Google registration successful! Please wait for admin approval.')
            navigate('/login')
        } catch (error: any) {
            console.error('Google auth error:', error)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Google authentication failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleFailure = () => {
        toast.error('Google authentication failed')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-emerald-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <FadeIn>
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8"
                        >
                            <UserPlus className="w-10 h-10 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            <TypewriterText text="Create Account" speed={100} />
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Register to start tracking prices
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
                                Sign up for an account
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Google Sign Up */}
                                {GOOGLE_CLIENT_ID && (
                                    <div>
                                        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleFailure}
                                                text="signup_with"
                                                shape="rectangular"
                                                theme="outline"
                                                width="100%"
                                            />
                                        </GoogleOAuthProvider>
                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                                    Or register with email
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* First and Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First name"
                                        leftIcon={<User className="w-5 h-5" />}
                                        error={errors['firstName']}
                                        required
                                    />
                                    <Input
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last name"
                                        leftIcon={<User className="w-5 h-5" />}
                                        error={errors['lastName']}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email address"
                                    leftIcon={<Mail className="w-5 h-5" />}
                                    error={errors['email']}
                                    required
                                />

                                {/* Password */}
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    leftIcon={<Lock className="w-5 h-5" />}
                                    error={errors['password']}
                                    isPassword
                                    showPasswordToggle
                                    required
                                />

                                {/* Confirm Password */}
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm password"
                                    leftIcon={<Lock className="w-5 h-5" />}
                                    error={errors['confirmPassword']}
                                    isPassword
                                    showPasswordToggle
                                    required
                                />

                                {/* Terms Notice */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        <strong>Note:</strong> After registration, your account will need admin approval before you can log in.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    isLoading={isLoading}
                                    rightIcon={!isLoading && <UserPlus className="w-5 h-5" />}
                                >
                                    {isLoading ? 'Creating account...' : 'Create account'}
                                </Button>

                                {/* Links */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Already have an account?{' '}
                                        <Link
                                            to="/login"
                                            className="font-medium text-emerald-600 hover:text-emerald-500"
                                        >
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Back to Home */}
                <FadeIn delay={0.5}>
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to home
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </div>
    )
}

export default Register