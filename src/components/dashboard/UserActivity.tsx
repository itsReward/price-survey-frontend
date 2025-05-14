import React from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, BarChart3 } from 'lucide-react'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import { UserActivity as UserActivityType } from '@/types/dashboard'

interface UserActivityProps {
    users: UserActivityType[]
    isLoading?: boolean
}

const UserActivity: React.FC<UserActivityProps> = ({
                                                       users,
                                                       isLoading = false
                                                   }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getActivityLevel = (entriesCount: number) => {
        if (entriesCount >= 50) return { level: 'High', color: 'text-green-600' }
        if (entriesCount >= 20) return { level: 'Medium', color: 'text-yellow-600' }
        if (entriesCount > 0) return { level: 'Low', color: 'text-blue-600' }
        return { level: 'Inactive', color: 'text-gray-400' }
    }

    return (
        <Card>
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
                                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : users.length > 0 ? (
                    <div className="space-y-4">
                        {users.map((user, index) => {
                            const activity = getActivityLevel(user.entriesCount)

                            return (
                                <motion.div
                                    key={user.userId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user.userName}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
                        {activity.level}
                      </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user.userEmail}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                                            <BarChart3 className="w-4 h-4 mr-1" />
                                            {user.entriesCount} entries
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Last: {formatDate(user.lastLogin)}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No user activity data</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default UserActivity