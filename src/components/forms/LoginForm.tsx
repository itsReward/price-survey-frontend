import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void
    isLoading: boolean
    error?: string | null
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{[key: string]: string}>({})

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

        if (!formData.email) {
            newErrors['email'] = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors['email'] = 'Please enter a valid email'
        }

        if (!formData.password) {
            newErrors['password'] = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors['password'] = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData.email, formData.password)
        }
    }

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
                    Sign in to your account
                </h3>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Login Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border ${
                                    errors['email'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                                placeholder="Email address"
                            />
                        </div>
                        {errors['email'] && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-1 text-sm text-red-600 dark:text-red-400"
                            >
                                {errors['email']}
                            </motion.p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border ${
                                    errors['password'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {errors['password'] && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-1 text-sm text-red-600 dark:text-red-400"
                            >
                                {errors['password']}
                            </motion.p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={!isLoading && <LogIn className="w-5 h-5" />}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>

                    {/* Additional Links */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                                Contact admin
                            </a>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default LoginForm