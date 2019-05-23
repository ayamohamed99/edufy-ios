import { TestBed } from '@angular/core/testing';

import { ImageCompressorService } from './image-compressor.service';

describe('ImageCompressorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageCompressorService = TestBed.get(ImageCompressorService);
    expect(service).toBeTruthy();
  });
});
