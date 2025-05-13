import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Package,
    Tag,
    Beaker,
    Info,
    Eye,
    EyeOff
} from 'lucide-react'
import FadeIn from '@/components/animations/FadeIn'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import ProductForm from '@/components/forms/ProductForm'
import { productService } from '@/services/product'
import { Product } from '@/types/product'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const Products: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [showInactive, setShowInactive] = useState(false)

    const { user } = useAuth()
    const queryClient = useQueryClient()

    const {
        data: products,
        isLoading: productsLoading,
        isError
    } = useQuery('products', productService.getProducts, {
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const { data: categories } = useQuery('categories', productService.getCategories)

    const createMutation = useMutation(productService.createProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries(['products'])
            toast.success('Product created successfully!')
            setIsFormOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create product')
        },
    })

    const updateMutation = useMutation(
        ({ id, data }: { id: number; data: any }) => productService.updateProduct(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['products'])
                toast.success('Product updated successfully!')
                setIsFormOpen(false)
                setSelectedProduct(null)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to update product')
            },
        }
    )

    const deleteMutation = useMutation(productService.deleteProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries(['products'])
            toast.success('Product deleted successfully!')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete product')
        },
    })

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleFormSubmit = (data: any) => {
        if (selectedProduct) {
            updateMutation.mutate({ id: selectedProduct.id, data })
        } else {
            createMutation.mutate(data)
        }
    }

    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = !selectedCategory || product.category === selectedCategory
        const matchesActive = showInactive || product.isActive

        return matchesSearch && matchesCategory && matchesActive
    })

    const formatVolume = (volumeMl: number) => {
        if (volumeMl >= 1000) {
            return `${(volumeMl / 1000).toFixed(1)}L`
        }
        return `${volumeMl}ml`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'beverage':
                return <Beaker className="w-5 h-5" />
            case 'food':
                return <Package className="w-5 h-5" />
            default:
                return <Tag className="w-5 h-5" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'beverage':
                return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
            case 'food':
                return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900'
            default:
                return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900'
        }
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardContent>
                        <p className="text-red-500">Error loading products</p>
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Products
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage your product catalog
                            </p>
                            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>Total: {products?.length || 0}</span>
                                <span>•</span>
                                <span>Active: {products?.filter(p => p.isActive).length || 0}</span>
                                <span>•</span>
                                <span>Categories: {categories?.length || 0}</span>
                            </div>
                        </div>
                        {user?.role === 'ADMIN' && (
                            <Button
                                onClick={() => {
                                    setSelectedProduct(null)
                                    setIsFormOpen(true)
                                }}
                                leftIcon={<Plus className="w-5 h-5" />}
                                className="bg-emerald-500 hover:bg-emerald-600"
                            >
                                Add Product
                            </Button>
                        )}
                    </div>
                </FadeIn>

                {/* Filters */}
                <FadeIn delay={0.1}>
                    <Card className="mb-6">
                        <CardContent>
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="w-full lg:w-48">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">All Categories</option>
                                        {categories?.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Show Inactive Toggle */}
                                <Button
                                    variant="outline"
                                    onClick={() => setShowInactive(!showInactive)}
                                    leftIcon={showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    className={showInactive ? 'border-emerald-500 text-emerald-600' : ''}
                                >
                                    {showInactive ? 'Hide' : 'Show'} Inactive
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productsLoading ? (
                        // Loading skeletons
                        Array.from({ length: 8 }).map((_, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Skeleton avatarSize="md" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton width="70%" height="20px" />
                                            <Skeleton width="50%" height="16px" />
                                        </div>
                                    </div>
                                    <Skeleton lines={2} />
                                    <div className="mt-4 flex justify-between">
                                        <Skeleton width="60px" height="24px" />
                                        <Skeleton width="80px" height="32px" />
                                    </div>
                                </div>
                            </FadeIn>
                        ))
                    ) : filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <FadeIn key={product.id} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ y: -4, shadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card hover className="h-full">
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                                                <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                                {product.name}
                                                            </h3>
                                                            {product.brand && (
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {product.brand}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!product.isActive && (
                                                        <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900 rounded-full">
                              Inactive
                            </span>
                                                    )}
                                                </div>

                                                {/* Category and Volume */}
                                                <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${getCategoryColor(product.category)}`}>
                            {getCategoryIcon(product.category)}
                              <span className="ml-1">{product.category}</span>
                          </span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatVolume(product.volumeMl)}
                          </span>
                                                </div>

                                                {/* Description */}
                                                {product.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                )}

                                                {/* Created Date */}
                                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                                    Created {formatDate(product.createdAt)}
                                                </div>

                                                {/* Actions */}
                                                {user?.role === 'ADMIN' && (
                                                    <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedProduct(product)
                                                                setIsFormOpen(true)
                                                            }}
                                                            leftIcon={<Edit className="w-4 h-4" />}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(product.id)}
                                                            leftIcon={<Trash2 className="w-4 h-4" />}
                                                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </FadeIn>
                        ))
                    ) : (
                        <FadeIn>
                            <div className="col-span-full text-center py-12">
                                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Get started by adding your first product'}
                                </p>
                                {user?.role === 'ADMIN' && !searchTerm && !selectedCategory && (
                                    <Button
                                        onClick={() => {
                                            setSelectedProduct(null)
                                            setIsFormOpen(true)
                                        }}
                                        leftIcon={<Plus className="w-5 h-5" />}
                                    >
                                        Add Product
                                    </Button>
                                )}
                            </div>
                        </FadeIn>
                    )}
                </div>

                {/* Category Summary */}
                {categories && categories.length > 0 && (
                    <FadeIn delay={0.5}>
                        <Card className="mt-8">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Products by Category
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {categories.map((category) => {
                                        const categoryProducts = products?.filter(p => p.category === category) || []
                                        const activeCount = categoryProducts.filter(p => p.isActive).length

                                        return (
                                            <motion.div
                                                key={category}
                                                whileHover={{ scale: 1.02 }}
                                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center cursor-pointer"
                                                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                                            >
                                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${getCategoryColor(category)}`}>
                                                    {getCategoryIcon(category)}
                                                </div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{category}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {activeCount} active / {categoryProducts.length} total
                                                </p>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </FadeIn>
                )}

                {/* Form Modal */}
                <AnimatePresence>
                    {isFormOpen && (
                        <ProductForm
                            product={selectedProduct}
                            onClose={() => {
                                setIsFormOpen(false)
                                setSelectedProduct(null)
                            }}
                            onSubmit={handleFormSubmit}
                            isLoading={createMutation.isLoading || updateMutation.isLoading}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Products;