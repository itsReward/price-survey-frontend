import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import {
    User,
    Mail,
    Calendar,
    Shield,
    Edit3,
    Save,
    X,
    Key,
    Building
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import FadeIn from '@/components/animations/FadeIn'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { userService } from '@/services/user'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || ''
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState<{[key: string]: string}>({})

    const updateMutation = useMutation(
        ({ id, data }: { id: number; data: any }) => userService.updateUser(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['auth', 'me'])
                toast.success('Profile updated successfully!')
                setIsEditing(false)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to update profile')
            },
        }
    )

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateProfile = () => {
        const newErrors: {[key: string]: string} = {}

        if (!profileData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!profileData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Invalid email format'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validatePassword = () => {
        const newErrors: {[key: string]: string} = {}

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required'
        }
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required'
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters'
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateProfile() && user) {
            updateMutation.mutate({
                id: user.id,
                data: {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName
                }
            })
        }
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validatePassword() && user) {
            updateMutation.mutate({
                id: user.id,
                data: {
                    password: passwordData.newPassword
                }
            })
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">User not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Profile Settings
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage your account information and preferences
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <FadeIn delay={0.1}>
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Profile Overview
                                </h2>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center space-y-4">
                                    <div className="flex justify-center">
                                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                            <User className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Shield className={`w-4 h-4 ${user.role === 'ADMIN' ? 'text-purple-500' : 'text-blue-500'}`} />
                                            <span className={`text-sm font-medium ${user.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'}`}>
                        {user.role}
                      </span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {formatDate(user.createdAt)}</span>
                                        </div>
                                    </div>

                                    {user.assignedStores && user.assignedStores.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Assigned Stores
                                            </h4>
                                            <div className="space-y-1">
                                                {user.assignedStores.map((store) => (
                                                    <div key={store.id} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Building className="w-3 h-3" />
                                                        <span>{store.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </FadeIn>

                    {/* Profile Edit Form */}
                    <FadeIn delay={0.2}>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Personal Information
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(!isEditing)}
                                        leftIcon={isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                    >
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleProfileChange}
                                        error={errors.firstName}
                                        disabled={!isEditing}
                                        leftIcon={<User className="w-5 h-5" />}
                                    />

                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleProfileChange}
                                        error={errors.lastName}
                                        disabled={!isEditing}
                                        leftIcon={<User className="w-5 h-5" />}
                                    />

                                    <Input
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        error={errors.email}
                                        disabled={true} // Email is not editable
                                        leftIcon={<Mail className="w-5 h-5" />}
                                        helperText="Email cannot be changed"
                                    />

                                    {isEditing && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="pt-4"
                                        >
                                            <Button
                                                type="submit"
                                                isLoading={updateMutation.isLoading}
                                                leftIcon={<Save className="w-4 h-4" />}
                                                className="w-full"
                                            >
                                                Save Changes
                                            </Button>
                                        </motion.div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </FadeIn>

                    {/* Password Change */}
                    <FadeIn delay={0.3}>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Change Password
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                                        leftIcon={isChangingPassword ? <X className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                                    >
                                        {isChangingPassword ? 'Cancel' : 'Change'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isChangingPassword ? (
                                    <motion.form
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onSubmit={handlePasswordSubmit}
                                        className="space-y-4"
                                    >
                                        <Input
                                            label="Current Password"
                                            name="currentPassword"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            error={errors.currentPassword}
                                            leftIcon={<Key className="w-5 h-5" />}
                                            isPassword
                                        />

                                        <Input
                                            label="New Password"
                                            name="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            error={errors.newPassword}
                                            leftIcon={<Key className="w-5 h-5" />}
                                            isPassword
                                        />

                                        <Input
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            error={errors.confirmPassword}
                                            leftIcon={<Key className="w-5 h-5" />}
                                            isPassword
                                        />

                                        <Button
                                            type="submit"
                                            isLoading={updateMutation.isLoading}
                                            leftIcon={<Save className="w-4 h-4" />}
                                            className="w-full"
                                        >
                                            Update Password
                                        </Button>
                                    </motion.form>
                                ) : (
                                    <div className="text-center py-8">
                                        <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Click "Change" to update your password
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </div>
    )
}

export default Profile