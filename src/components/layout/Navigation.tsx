import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home,
    BarChart3,
    Store,
    Package,
    Receipt,
    User,
    Settings,
    ChevronDown,
    Clock,
    TrendingUp
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface NavigationItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    children?: NavigationItem[]
    adminOnly?: boolean
}

const Navigation: React.FC = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const { user, isAuthenticated } = useAuth()
    const location = useLocation()

    const navigationItems: NavigationItem[] = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: BarChart3
        },
        {
            name: 'Price Entries',
            href: '/price-entries',
            icon: Receipt,
            children: [
                { name: 'All Entries', href: '/price-entries', icon: Receipt },
                { name: 'My Entries', href: '/price-entries/my', icon: User },
                { name: 'Recent', href: '/price-entries/recent', icon: Clock },
            ]
        },
        {
            name: 'Products',
            href: '/products',
            icon: Package,
            children: [
                { name: 'All Products', href: '/products', icon: Package },
                { name: 'Categories', href: '/products/categories', icon: Package },
            ]
        },
        {
            name: 'Stores',
            href: '/stores',
            icon: Store,
            children: [
                { name: 'All Stores', href: '/stores', icon: Store },
                { name: 'Map View', href: '/stores/map', icon: Store },
            ]
        },
        {
            name: 'Reports',
            href: '/reports',
            icon: TrendingUp,
            adminOnly: true,
            children: [
                { name: 'Price Trends', href: '/reports/trends', icon: TrendingUp },
                { name: 'Store Comparison', href: '/reports/stores', icon: Store },
                { name: 'Product Analysis', href: '/reports/products', icon: Package },
            ]
        },
        {
            name: 'Profile',
            href: '/profile',
            icon: User
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
            adminOnly: true
        },
    ]

    const filteredNavigation = navigationItems.filter(item =>
        !item.adminOnly || user?.role === 'ADMIN'
    )

    const isActiveItem = (href: string) => {
        if (href === '/') return location.pathname === '/'
        return location.pathname.startsWith(href)
    }

    const handleDropdownToggle = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name)
    }

    if (!isAuthenticated) return null

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        {filteredNavigation.map((item) => (
                            <div key={item.name} className="relative">
                                {item.children ? (
                                    <div>
                                        <button
                                            onClick={() => handleDropdownToggle(item.name)}
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                                isActiveItem(item.href)
                                                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900 dark:text-emerald-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900'
                                            }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.name}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${
                                                    openDropdown === item.name ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {openDropdown === item.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50"
                                                >
                                                    <div className="py-1">
                                                        {item.children.map((child) => (
                                                            <Link
                                                                key={child.href}
                                                                to={child.href}
                                                                onClick={() => setOpenDropdown(null)}
                                                                className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200 ${
                                                                    isActiveItem(child.href)
                                                                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900 dark:text-emerald-400'
                                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-emerald-600'
                                                                }`}
                                                            >
                                                                <child.icon className="w-4 h-4" />
                                                                <span>{child.name}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        to={item.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                            isActiveItem(item.href)
                                                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900 dark:text-emerald-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation