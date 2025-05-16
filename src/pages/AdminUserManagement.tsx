import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    UserCheck,
    UserX,
    Store,
    Shield,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react'
import FadeIn from '@/components/animations/FadeIn'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/Modal'
import StoreAssignmentModal from '@/components/admin/StoreAssignmentModal'
import { userService } from '@/services/user'
import { User } from '@/types/auth'
import toast from 'react-hot-toast'

const AdminUserManagement: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showStoreModal, setShowStoreModal] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [actionType, setActionType] = useState<'activate' | 'deactivate' | null>(null)
    const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'active' | 'inactive'>('all')

    const queryClient = useQueryClient()

    const { data: users, isLoading } = useQuery('admin-users', userService.getUsers, {
        staleTime: 5 * 60 * 1000,
    })

    const { data: pendingUsers } = useQuery('pending-users', userService.getPendingUsers, {
        staleTime: 30 * 1000,
    })

    const activateUserMutation = useMutation(
        (userId: number) => userService.updateUserStatus(userId, true),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['admin-users'])
                queryClient.invalidateQueries(['pending-users'])
                toast.success('User activated successfully!')
                setShowConfirmDialog(false)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to activate user')
            },
        }
    )

    const deactivateUserMutation = useMutation(
        (userId: number) => userService.updateUserStatus(userId, false),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['admin-users'])
                queryClient.invalidateQueries(['pending-users'])
                toast.success('User deactivated successfully!')
                setShowConfirmDialog(false)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to deactivate user')
            },
        }
    )

    const handleUserAction = (user: User, action: 'activate' | 'deactivate') => {
        setSelectedUser(user)
        setActionType(action)
        setShowConfirmDialog(true)
    }

    const handleConfirmAction = () => {
        if (!selectedUser || !actionType) return

        if (actionType === 'activate') {
            activateUserMutation.mutate(selectedUser.id)
        } else {
            deactivateUserMutation.mutate(selectedUser.id)
        }
    }

    const handleAssignStores = (user: User) => {
        setSelectedUser(user)
        setShowStoreModal(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusIcon = (isActive: boolean) => {
        return isActive ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
            <XCircle className="w-5 h-5 text-red-500" />
        )
    }

    const getRoleIcon = (role: string) => {
        return role === 'ADMIN' ? (
            <Shield className="w-4 h-4 text-purple-500" />
        ) : (
            <Users className="w-4 h-4 text-blue-500" />
        )
    }

    const filteredUsers = users?.filter(user => {
        switch (selectedTab) {
            case 'pending':
                return !user.isActive
            case 'active':
                return user.isActive
            case 'inactive':
                return !user.isActive
            default:
                return true
        }
    })

    const stats = [
        {
            label: 'Total Users',
            value: users?.length || 0,
            icon: Users,
            color: 'text-blue-500'
        },
        {
            label: 'Pending Approval',
            value: pendingUsers?.length || 0,
            icon: Clock,
            color: 'text-yellow-500'
        },
        {
            label: 'Active Users',
            value: users?.filter(u => u.isActive).length || 0,
            icon: CheckCircle,
            color: 'text-green-500'
        },
        {
            label: 'Inactive Users',
            value: users?.filter(u => !u.isActive).length || 0,
            icon: XCircle,
            color: 'text-red-500'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <FadeIn>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            User Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage user accounts and store assignments
                        </p>
                    </div>
                </FadeIn>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <FadeIn key={stat.label} delay={index * 0.1}>
                            <Card>
                                <CardContent>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {stat.label}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    ))}
                </div>

                {/* Tabs */}
                <FadeIn delay={0.2}>
                    <div className="mb-6">
                        <nav className="flex space-x-4">
                            {[
                                { id: 'all', label: 'All Users', count: users?.length || 0 },
                                { id: 'pending', label: 'Pending', count: pendingUsers?.length || 0 },
                                { id: 'active', label: 'Active', count: users?.filter(u => u.isActive).length || 0 },
                                { id: 'inactive', label: 'Inactive', count: users?.filter(u => !u.isActive).length || 0 }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedTab === tab.id
                                            ? 'bg-emerald-500 text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/20">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </FadeIn>

                {/* Users List */}
                <FadeIn delay={0.3}>
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {selectedTab === 'all' ? 'All Users' :
                                    selectedTab === 'pending' ? 'Pending Users' :
                                        selectedTab === 'active' ? 'Active Users' : 'Inactive Users'}
                            </h3>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <Skeleton avatarSize="md" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="40%" height="20px" />
                                                <Skeleton width="60%" height="16px" />
                                            </div>
                                            <Skeleton width="100px" height="32px" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredUsers && filteredUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Role & Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Assigned Stores
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredUsers.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                                                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        {getRoleIcon(user.role)}
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {user.role}
                                                            </span>
                                                    </div>
                                                    <div className="mt-1 flex items-center space-x-1">
                                                        {getStatusIcon(user.isActive)}
                                                        <span className={`text-xs ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                                {user.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-1">
                                                        <Store className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900 dark:text-white">
                                                                {user.assignedStores.length} stores
                                                            </span>
                                                    </div>
                                                    {user.assignedStores.length > 0 && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {user.assignedStores.slice(0, 2).map(store => store.name).join(', ')}
                                                            {user.assignedStores.length > 2 && ` +${user.assignedStores.length - 2} more`}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleAssignStores(user)}
                                                            leftIcon={<Store className="w-4 h-4" />}
                                                        >
                                                            Stores
                                                        </Button>
                                                        {user.isActive ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleUserAction(user, 'deactivate')}
                                                                leftIcon={<UserX className="w-4 h-4" />}
                                                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                Deactivate
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleUserAction(user, 'activate')}
                                                                leftIcon={<UserCheck className="w-4 h-4" />}
                                                                className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                            >
                                                                Activate
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No users found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {selectedTab === 'pending' ? 'No pending users at the moment' : 'No users match the current filter'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Modals */}
                <AnimatePresence>
                    {showStoreModal && selectedUser && (
                        <StoreAssignmentModal
                            user={selectedUser}
                            onClose={() => {
                                setShowStoreModal(false)
                                setSelectedUser(null)
                            }}
                            onSuccess={() => {
                                queryClient.invalidateQueries(['admin-users'])
                            }}
                        />
                    )}
                </AnimatePresence>

                <ConfirmDialog
                    isOpen={showConfirmDialog}
                    onClose={() => setShowConfirmDialog(false)}
                    onConfirm={handleConfirmAction}
                    title={actionType === 'activate' ? 'Activate User' : 'Deactivate User'}
                    message={`Are you sure you want to ${actionType} ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
                    confirmText={actionType === 'activate' ? 'Activate' : 'Deactivate'}
                    type={actionType === 'activate' ? 'info' : 'warning'}
                    loading={activateUserMutation.isLoading || deactivateUserMutation.isLoading}
                />
            </div>
        </div>
    )
}

export default AdminUserManagement