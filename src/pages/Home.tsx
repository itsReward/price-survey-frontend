import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Store, Package, TrendingUp, Users, Shield, Zap } from 'lucide-react'
import TypewriterText from '@/components/animations/TypewriterText'
import FadeIn from '@/components/animations/FadeIn'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'

const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth()
    const [showGreeting, setShowGreeting] = useState(false)

    const greetings = [
        "Welcome to Price Survey",
        "Track prices with ease",
        "Make informed decisions",
        "Compare across stores"
    ]

    const features = [
        {
            icon: BarChart3,
            title: "Price Analytics",
            description: "Get insights into price trends and market analysis with beautiful visualizations."
        },
        {
            icon: Store,
            title: "Store Management",
            description: "Organize and track multiple store locations with ease and efficiency."
        },
        {
            icon: Package,
            title: "Product Catalog",
            description: "Maintain a comprehensive database of products with detailed information."
        },
        {
            icon: TrendingUp,
            title: "Trend Analysis",
            description: "Identify market trends and price patterns to make better decisions."
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Work together with your team to collect and analyze price data."
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            description: "Enterprise-grade security with reliable data backup and protection."
        }
    ]

    useEffect(() => {
        const timer = setTimeout(() => setShowGreeting(true), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-emerald-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <FadeIn>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                                <TypewriterText
                                    text="Track Prices. Make Decisions."
                                    speed={80}
                                    className="text-gradient"
                                    onComplete={() => setShowGreeting(true)}
                                />
                            </h1>
                        </FadeIn>

                        {showGreeting && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-4"
                            >
                                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                    Empower your business with comprehensive price tracking and analytics across multiple stores.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                    {isAuthenticated ? (
                                        <Link to="/dashboard">
                                            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                                Go to Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/login">
                                                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                                    Get Started
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="lg">
                                                Learn More
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Animated Background Elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 opacity-20">
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                scale: { duration: 4, repeat: Infinity }
                            }}
                            className="w-full h-full bg-emerald-400 rounded-full"
                        />
                    </div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 opacity-10">
                        <motion.div
                            animate={{
                                rotate: -360,
                                y: [-10, 10, -10]
                            }}
                            transition={{
                                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                y: { duration: 5, repeat: Infinity }
                            }}
                            className="w-full h-full bg-green-400 rounded-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Powerful Features
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Everything you need to track, analyze, and make informed pricing decisions
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FadeIn key={feature.title} delay={index * 0.1}>
                                <Card hover className="h-full">
                                    <CardContent>
                                        <div className="text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-lg mb-4">
                                                <feature.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-emerald-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { number: '10K+', label: 'Price Entries' },
                            { number: '500+', label: 'Active Stores' },
                            { number: '99.9%', label: 'Uptime' }
                        ].map((stat, index) => (
                            <FadeIn key={stat.label} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
                                >
                                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 text-lg">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <FadeIn>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to get started?
                        </h2>
                        <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of businesses using Price Survey to make better pricing decisions.
                        </p>
                        {!isAuthenticated && (
                            <Link to="/login">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                    className="bg-white text-emerald-600 hover:bg-gray-50"
                                >
                                    Start Tracking Prices
                                </Button>
                            </Link>
                        )}
                    </FadeIn>
                </div>
            </section>
        </div>
    )
}

export default Home