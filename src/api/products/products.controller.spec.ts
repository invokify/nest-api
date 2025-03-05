import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UnauthorizedException } from '@nestjs/common';
import { CustomRequest } from 'src/middleware/auth.middleware';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockProduct = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock_quantity: 100,
    owner_id: '123e4567-e89b-12d3-a456-426614174111',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct];
      jest.spyOn(service, 'findAll').mockResolvedValue(products);

      expect(await controller.findAll()).toBe(products);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      expect(await controller.findOne(mockProduct.id)).toBe(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  describe('create', () => {
    const createProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      stock_quantity: 100,
      owner_id: '123e4567-e89b-12d3-a456-426614174111',
    };

    it('should create a product when user is authenticated', async () => {
      const mockRequest = {
        user: {
          id: createProductDto.owner_id,
        }
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

      const result = await controller.create(mockRequest as CustomRequest, createProductDto);
      
      expect(result).toBe(mockProduct);
      expect(service.create).toHaveBeenCalledWith({
        ...createProductDto,
        owner_id: mockRequest.user.id,
      });
    });

    it('should throw UnauthorizedException when user is not authenticated (method 2)', async () => {
        const mockRequestWithoutUser = { user: null };
        
        try {
            await controller.create(mockRequestWithoutUser as CustomRequest, createProductDto);
            fail('Expected an error to be thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { name: 'Updated Product' };
      jest.spyOn(service, 'update').mockResolvedValue({ ...mockProduct, ...updateProductDto });

      expect(await controller.update(mockProduct.id, updateProductDto)).toEqual({
        ...mockProduct,
        ...updateProductDto,
      });
      expect(service.update).toHaveBeenCalledWith(mockProduct.id, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(mockProduct.id);
      expect(service.remove).toHaveBeenCalledWith(mockProduct.id);
    });
  });
}); 