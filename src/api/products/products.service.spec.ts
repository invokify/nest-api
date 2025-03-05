import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { SupabaseService } from '../../supabase/supabase.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let supabaseService: SupabaseService;

  const mockSupabaseService = {
    getClient: jest.fn(() => ({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  };

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockResponse = { data: [mockProduct], error: null };
      const mockFrom = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockResponse),
      };
      jest.spyOn(mockSupabaseService, 'getClient').mockReturnValue(mockFrom as any);

      const result = await service.findAll();
      expect(result).toEqual([mockProduct]);
    });

    it('should throw error when supabase query fails', async () => {
      const mockError = { message: 'Database error' };
      const mockResponse = { data: null, error: mockError };
      const mockFrom = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockResponse),
      };
      jest.spyOn(mockSupabaseService, 'getClient').mockReturnValue(mockFrom as any);

      await expect(service.findAll()).rejects.toEqual(mockError);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockResponse = { data: mockProduct, error: null };
      const mockFrom = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(mockResponse),
      };
      jest.spyOn(mockSupabaseService, 'getClient').mockReturnValue(mockFrom as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const createProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        stock_quantity: 100,
        owner_id: '1',
      };
      const mockResponse = { data: { ...mockProduct, ...createProductDto }, error: null };
      const mockFrom = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(mockResponse),
      };
      jest.spyOn(mockSupabaseService, 'getClient').mockReturnValue(mockFrom as any);

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const updateProductDto = { price: 199.99 };
      const mockResponse = { data: { ...mockProduct, ...updateProductDto }, error: null };
      const mockFrom = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(mockResponse),
      };
      jest.spyOn(mockSupabaseService, 'getClient').mockReturnValue(mockFrom as any);

      const result = await service.update('1', updateProductDto);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockResponse = { error: null };
      const mockFrom = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue(mockResponse),
      };
      jest.spyOn(mockSupabaseService, 'getClient').mockReturnValue(mockFrom as any);

      await expect(service.remove('1')).resolves.not.toThrow();
    });
  });
}); 