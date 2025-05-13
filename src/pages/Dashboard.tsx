import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { BarChart3, Package, Store, Users, DollarSign } from 'lucide-react'
import FadeIn from '@/components/animations/FadeIn'
import LoadingDots from '@/components/animations/LoadingDots'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton'
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardService } from '@/services/dashboard'
import { useAuth } from '@/context/AuthContext'

const Dashboard: React.FC = () => {
    const { user } = useAuth()
    const [filters] = useState({})

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

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Price by Store Chart */}
                    <FadeIn delay={0.2}>
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
                                            <XAxis dataKey="storeName" />
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
                    <FadeIn delay={0.3}>
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

                {/* Recent Entries */}
                <FadeIn delay={0.4}>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Recent Price Entries
                                </h3>
                                <Button variant="ghost" size="sm">
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <Skeleton avatarSize="md" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="70%" height="16px" />
                                                <Skeleton width="40%" height="14px" />
                                            </div>
                                            <Skeleton width="80px" height="24px" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {dashboardData?.recentEntries?.map((entry) => (
                                        <motion.div
                                            key={entry.id}
                                            whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                                            className="flex items-center space-x-4 p-3 rounded-lg transition-colors"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {entry.productName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {entry.storeName}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                        <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(Number(entry.price))}
                        </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* User Activity (Admin Only) */}
                {user?.role === 'ADMIN' && (
                    <FadeIn delay={0.5}>
                        <Card className="mt-8">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    User Activity
                                </h3>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="flex items-center space-x-4">
                                                <Skeleton avatarSize="sm" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton width="50%" height="16px" />
                                                    <Skeleton width="30%" height="14px" />
                                                </div>
                                                <Skeleton width="60px" height="20px" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {dashboardData?.userActivity?.map((activity) => (
                                            <div key={activity.userId} className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {activity.userName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {activity.userEmail}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {activity.entriesCount} entries
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Last login: {activity.lastLogin ? new Date(activity.lastLogin).toLocaleDateString() : 'Never'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </FadeIn>
                )}
            </div>
        </div>
    )
}

export default Dashboard