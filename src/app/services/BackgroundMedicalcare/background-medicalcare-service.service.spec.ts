import { TestBed } from '@angular/core/testing';

import { BackgroundMedicalcareService } from './background-medicalcare-service.service';

describe('BackgroundMedicalcareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackgroundMedicalcareService = TestBed.get(BackgroundMedicalcareService);
    expect(service).toBeTruthy();
  });
});
