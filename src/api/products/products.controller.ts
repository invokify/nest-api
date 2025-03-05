import { Req, Body, Controller, Delete, Get, Param, Post, Put, Logger, UnauthorizedException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, CreateProduct } from './interfaces/product.interface';
import { CustomRequest } from 'src/middleware/auth.middleware';
import { UUID } from 'crypto';

@Controller('api/products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Req() req: CustomRequest, @Body() product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    this.logger.debug(`Request user object: ${JSON.stringify(req.user)}`);
    
    const ownerId = req.user?.id;
    console.log('Request user object:', req.user, 'Owner ID:', ownerId);
    if (!ownerId) {
      this.logger.error('Attempted to create product without authentication');
      throw new UnauthorizedException('User must be authenticated to create products');
    }

    product.owner_id = ownerId as UUID;
    
    this.logger.log(`Creating new product: ${product.name} for owner: ${product.owner_id}`);
    return this.productsService.create(product);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() product: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
} 