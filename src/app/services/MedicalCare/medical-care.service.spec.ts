import { TestBed } from '@angular/core/testing';

import { MedicalCareService } from './medical-care.service';

describe('MedicalCareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedicalCareService = TestBed.get(MedicalCareService);
    expect(service).toBeTruthy();
  });
});
