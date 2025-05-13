import { apiService } from './api'
import { Product, ProductRequest, UpdateProductRequest } from '@/types/product'

class ProductService {
    async getProducts(): Promise<Product[]> {
        return await apiService.get<Product[]>('/api/products')
    }

    async getProductById(id: number): Promise<Product> {
        return await apiService.get<Product>(`/api/products/${id}`)
    }

    async createProduct(data: ProductRequest): Promise<Product> {
        return await apiService.post<Product>('/api/products', data)
    }

    async updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
        return await apiService.put<Product>(`/api/products/${id}`, data)
    }

    async deleteProduct(id: number): Promise<void> {
        return await apiService.delete(`/api/products/${id}`)
    }

    async getProductsByCategory(category: string): Promise<Product[]> {
        return await apiService.get<Product[]>(`/api/products/category/${category}`)
    }

    async getProductsByBrand(brand: string): Promise<Product[]> {
        return await apiService.get<Product[]>(`/api/products/brand/${brand}`)
    }

    async getCategories(): Promise<string[]> {
        return await apiService.get<string[]>('/api/products/categories')
    }

    async getAvailableVolumes(): Promise<number[]> {
        return await apiService.get<number[]>('/api/products/volumes')
    }
}

export const productService = new ProductService()