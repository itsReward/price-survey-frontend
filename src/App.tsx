import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/ui/Spinner'

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const PriceEntries = React.lazy(() => import('./pages/PriceEntries'))
const Products = React.lazy(() => import('./pages/Products'))
const Stores = React.lazy(() => import('./pages/Stores'))
const Profile = React.lazy(() => import('./pages/Profile'))
const AdminUserManagement = React.lazy(() => import('./pages/AdminUserManagement'))

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
                    <Layout>
                        <Suspense fallback={
                            <div className="flex items-center justify-center min-h-screen">
                                <LoadingSpinner size="lg" />
                            </div>
                        }>
                            <AnimatePresence mode="wait">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <motion.div {...pageTransition}>
                                                <Home />
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        path="/login"
                                        element={
                                            <motion.div {...pageTransition}>
                                                <Login />
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        path="/register"
                                        element={
                                            <motion.div {...pageTransition}>
                                                <Register />
                                            </motion.div>
                                        }
                                    />
                                    <Route path="/dashboard" element={
                                        <ProtectedRoute>
                                            <motion.div {...pageTransition}>
                                                <Dashboard />
                                            </motion.div>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/price-entries" element={
                                        <ProtectedRoute>
                                            <motion.div {...pageTransition}>
                                                <PriceEntries />
                                            </motion.div>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/products" element={
                                        <ProtectedRoute>
                                            <motion.div {...pageTransition}>
                                                <Products />
                                            </motion.div>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/stores" element={
                                        <ProtectedRoute>
                                            <motion.div {...pageTransition}>
                                                <Stores />
                                            </motion.div>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/profile" element={
                                        <ProtectedRoute>
                                            <motion.div {...pageTransition}>
                                                <Profile />
                                            </motion.div>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/admin/users" element={
                                        <ProtectedRoute requiredRole="ADMIN">
                                            <motion.div {...pageTransition}>
                                                <AdminUserManagement />
                                            </motion.div>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </AnimatePresence>
                        </Suspense>
                    </Layout>
                </div>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App