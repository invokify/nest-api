import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { Product, CreateProduct } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('products')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<Product> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
      if (error) {
        this.logger.error('Failed to get product', {
          error: error.message,
          details: error.details,
          data: data,
        });
        throw error;
      }
      return data;
  }

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      this.logger.error('Failed to create product', {
        error: error,
        details: error.details,
        product
      });
      throw error;
    }
    return data;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('products')
      .delete()
      .eq('id', id);
    
      if (error) {
        this.logger.error('Failed to create product', {
          error: error.message,
          details: error.details
        });
        throw error;
      }
  }
} 