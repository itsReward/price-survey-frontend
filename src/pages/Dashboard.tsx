import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { BarChart3, Package, Store, Users, DollarSign } from 'lucide-react'
import FadeIn from '@/components/animations/FadeIn'
import LoadingDots from '@/components/animations/LoadingDots'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton'
import StoreMap from '@/components/dashboard/StoreMap'
import RecentEntries from '@/components/dashboard/RecentEntries'
import UserActivity from '@/components/dashboard/UserActivity'
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardService } from '@/services/dashboard'
import { useAuth } from '@/context/AuthContext'
import StoreMapDebugger from '@/components/StoreMapDebugger'

const Dashboard: React.FC = () => {
    const { user } = useAuth()
    const [filters] = useState({})
    const [showMapFullscreen, setShowMapFullscreen] = useState(false)

    const {
        data: dashboardData,
        isLoading,
        isError
    } = useQuery(
        ['dashboard', filters],
        () => dashboardService.getDashboardData(filters),
        {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
        }
    )

    const stats = [
        {
            title: 'Total Price Entries',
            value: dashboardData?.totalPriceEntries || 0,
            icon: BarChart3,
            color: 'emerald',
            change: '+12%'
        },
        {
            title: 'Active Stores',
            value: dashboardData?.totalStores || 0,
            icon: Store,
            color: 'blue',
            change: '+5%'
        },
        {
            title: 'Products Tracked',
            value: dashboardData?.totalProducts || 0,
            icon: Package,
            color: 'purple',
            change: '+8%'
        },
        {
            title: 'Average Price',
            value: dashboardData?.recentEntries?.[0]?.price || 0,
            icon: DollarSign,
            color: 'orange',
            change: '-2%',
            prefix: '$'
        }
    ]

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value)
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardContent>
                        <p className="text-red-500">Error loading dashboard data</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <FadeIn>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {user?.firstName}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Here's what's happening with your price tracking
                        </p>
                    </div>
                </FadeIn>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <FadeIn key={stat.title} delay={index * 0.1}>
                            <motion.div whileHover={{ scale: 1.02 }}>
                                {isLoading ? (
                                    <SkeletonCard />
                                ) : (
                                    <Card>
                                        <CardContent>
                                            <div className="flex items-center">
                                                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {stat.title}
                                                    </p>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {stat.prefix || ''}{stat.value.toLocaleString()}
                                                    </p>
                                                    <p className={`text-sm ${
                                                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {stat.change} from last month
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                <StoreMapDebugger />

                {/* Store Map */}
                <FadeIn delay={0.2}>
                    <div className="mb-8">
                        <StoreMap height="h-96" showControls={true} />
                    </div>
                </FadeIn>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Price by Store Chart */}
                    <FadeIn delay={0.3}>
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Average Price by Store
                                </h3>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-80 flex items-center justify-center">
                                        <LoadingDots />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dashboardData?.priceByStore || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="storeName"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                            />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => [formatCurrency(Number(value)), 'Average Price']}
                                            />
                                            <Bar dataKey="averagePrice" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </FadeIn>

                    {/* Price Trends Chart */}
                    <FadeIn delay={0.4}>
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Price Trends Over Time
                                </h3>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-80 flex items-center justify-center">
                                        <LoadingDots />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dashboardData?.priceByDate || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => [formatCurrency(Number(value)), 'Average Price']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="averagePrice"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                dot={{ fill: '#10b981' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </FadeIn>
                </div>

                {/* Recent Entries and User Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Entries */}
                    <FadeIn delay={0.5}>
                        <RecentEntries
                            entries={dashboardData?.recentEntries || []}
                            isLoading={isLoading}
                            onViewAll={() => {/* Navigate to price entries page */}}
                        />
                    </FadeIn>

                    {/* User Activity (Admin Only) */}
                    {user?.role === 'ADMIN' && (
                        <FadeIn delay={0.6}>
                            <UserActivity
                                users={dashboardData?.userActivity || []}
                                isLoading={isLoading}
                            />
                        </FadeIn>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard