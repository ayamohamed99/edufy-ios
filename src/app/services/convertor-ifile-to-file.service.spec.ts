import { TestBed } from '@angular/core/testing';

import { ConvertorIFileToFileService } from './convertor-ifile-to-file.service';

describe('ConvertorIFileToFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConvertorIFileToFileService = TestBed.get(ConvertorIFileToFileService);
    expect(service).toBeTruthy();
  });
});
