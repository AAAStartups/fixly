import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('brands')
  async getBrands() {
    return this.catalogService.getBrands();
  }

  @Get('brands/:id/models')
  async getModelsByBrand(@Param('id') brandId: string) {
    return this.catalogService.getModelsByBrand(brandId);
  }

  @Get('services')
  async getServices() {
    return this.catalogService.getServices();
  }

  @Get('estimates')
  async getEstimates(@Query('issue') issue?: string) {
    return this.catalogService.getEstimates(issue);
  }
}
