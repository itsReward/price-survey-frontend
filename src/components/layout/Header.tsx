import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Menu,
    X,
    Home,
    BarChart3,
    Store,
    Package,
    Receipt,
    User,
    Moon,
    Sun,
    LogOut,
    Shield,
    Users
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import Button from '@/components/ui/Button'

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, logout, isAuthenticated } = useAuth()
    const { isDark, toggleDarkMode } = useTheme()
    const location = useLocation()

    const navigation = [
        { name: 'Home', href: '/', icon: Home },
        ...(isAuthenticated ? [
            { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
            { name: 'Price Entries', href: '/price-entries', icon: Receipt },
            { name: 'Products', href: '/products', icon: Package },
            { name: 'Stores', href: '/stores', icon: Store },
            { name: 'Profile', href: '/profile', icon: User },
            // Admin-only routes
            ...(user?.role === 'ADMIN' ? [
                { name: 'User Management', href: '/admin/users', icon: Users }
            ] : [])
        ] : [])
    ]

    const isCurrentPath = (path: string) => location.pathname === path

    return (
        <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-emerald-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-emerald-500 text-white p-2 rounded-lg"
                        >
                            <BarChart3 className="w-6 h-6" />
                        </motion.div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
              Price Survey
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    isCurrentPath(item.href)
                                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900 dark:text-emerald-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900'
                                }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleDarkMode}
                            className="p-2"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </Button>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                {/* User Badge */}
                                <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900 px-3 py-1 rounded-full">
                                    {user?.role === 'ADMIN' && (
                                        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    )}
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.firstName} {user?.lastName}
                  </span>
                                </div>

                                {/* Logout Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                    leftIcon={<LogOut className="w-4 h-4" />}
                                    className="hidden sm:flex"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <Button variant="outline" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-700"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                                        isCurrentPath(item.href)
                                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900 dark:text-emerald-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-2 px-3 py-2">
                                        {user?.role === 'ADMIN' && (
                                            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.firstName} {user?.lastName}
                    </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            logout()
                                            setIsMenuOpen(false)
                                        }}
                                        leftIcon={<LogOut className="w-4 h-4" />}
                                        className="mx-3 mt-2 w-full sm:w-auto"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-3 py-2"
                                    >
                                        <Button variant="outline" size="sm" className="w-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-3 py-2"
                                    >
                                        <Button variant="primary" size="sm" className="w-full">
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header