import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Package, Tag, Beaker, FileText, Hash } from 'lucide-react'
import { useQuery } from 'react-query'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import { Product, ProductRequest } from '@/types/product'
import { productService } from '@/services/product'

interface ProductFormProps {
    product?: Product | null
    onClose: () => void
    onSubmit: (data: ProductRequest) => void
    isLoading: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
                                                     product,
                                                     onClose,
                                                     onSubmit,
                                                     isLoading
                                                 }) => {
    const [formData, setFormData] = useState<ProductRequest>({
        name: product?.name || '',
        description: product?.description || '',
        category: product?.category || '',
        volumeMl: product?.volumeMl || 0,
        brand: product?.brand || ''
    })

    const [errors, setErrors] = useState<{[key: string]: string}>({})

    // Fetch existing categories for dropdown
    const { data: categories } = useQuery('categories', productService.getCategories)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'volumeMl' ? parseInt(value) || 0 : value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {}

        if (!formData.name.trim()) newErrors['name'] = 'Product name is required'
        if (!formData.category.trim()) newErrors['category'] = 'Category is required'
        if (!formData.volumeMl || formData.volumeMl <= 0) newErrors['volumeMl'] = 'Valid volume is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            // Clean up the data before submitting
            const cleanData = {
                ...formData,
                description: formData.description || undefined,
                brand: formData.brand || undefined
            }
            onSubmit(cleanData)
        }
    }

    const volumePresets = [
        { label: '100ml', value: 100 },
        { label: '250ml', value: 250 },
        { label: '330ml', value: 330 },
        { label: '500ml', value: 500 },
        { label: '750ml', value: 750 },
        { label: '1L', value: 1000 },
        { label: '1.5L', value: 1500 },
        { label: '2L', value: 2000 },
    ]

    const categoryPresets = [
        'Beverage',
        'Food',
        'Snack',
        'Dairy',
        'Meat',
        'Vegetable',
        'Fruit',
        'Bakery',
        'Other'
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {product ? 'Edit Product' : 'Add Product'}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="p-2"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Product Name *
                                </label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['name'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter product name"
                                    />
                                </div>
                                {errors['name'] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                                    >
                                        {errors['name']}
                                    </motion.p>
                                )}
                            </div>

                            {/* Category and Brand Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category */}
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category *
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                                errors['category'] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select category</option>
                                            {/* Existing categories from API */}
                                            {categories?.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                            {/* Pre-defined categories */}
                                            {categoryPresets.filter(preset => !categories?.includes(preset)).map((preset) => (
                                                <option key={preset} value={preset}>{preset}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors['category'] && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-600 dark:text-red-400"
                                        >
                                            {errors['category']}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Brand */}
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Brand
                                    </label>
                                    <div className="relative">
                                        <Beaker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            id="brand"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Enter brand name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Volume */}
                            <div>
                                <label htmlFor="volumeMl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Volume (ml) *
                                </label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            id="volumeMl"
                                            name="volumeMl"
                                            min="1"
                                            value={formData.volumeMl}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                                errors['volumeMl'] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter volume in ml"
                                        />
                                    </div>
                                    {/* Volume Presets */}
                                    <div className="flex flex-wrap gap-2">
                                        {volumePresets.map((preset) => (
                                            <Button
                                                key={preset.value}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFormData(prev => ({ ...prev, volumeMl: preset.value }))}
                                                className={`h-8 ${formData.volumeMl === preset.value ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900' : ''}`}
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                {errors['volumeMl'] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                                    >
                                        {errors['volumeMl']}
                                    </motion.p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter product description (optional)"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    isLoading={isLoading}
                                    leftIcon={<Save className="w-5 h-5" />}
                                >
                                    {product ? 'Update' : 'Save'} Product
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export default ProductForm