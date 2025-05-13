import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

const Footer: React.FC = () => {
    const socialLinks = [
        { name: 'GitHub', icon: Github, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'LinkedIn', icon: Linkedin, href: '#' },
        { name: 'Email', icon: Mail, href: 'mailto:hello@pricesurvey.com' },
    ]

    const footerLinks = [
        {
            title: 'Product',
            links: [
                { name: 'Features', href: '#' },
                { name: 'Pricing', href: '#' },
                { name: 'API', href: '#' },
                { name: 'Documentation', href: '#' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Contact', href: '#' },
            ],
        },
        {
            title: 'Support',
            links: [
                { name: 'Help Center', href: '#' },
                { name: 'Community', href: '#' },
                { name: 'Status', href: '#' },
                { name: 'Security', href: '#' },
            ],
        },
    ]

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="bg-emerald-500 text-white p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                Price Survey
              </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Track and analyze prices across multiple stores to make informed decisions.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-200"
                                    aria-label={link.name}
                                >
                                    <link.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="col-span-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            © {new Date().getFullYear()} Price Survey. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm mt-4 md:mt-0">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                            <span>by the Price Survey team</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer