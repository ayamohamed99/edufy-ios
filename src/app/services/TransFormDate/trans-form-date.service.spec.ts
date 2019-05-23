import { TestBed } from '@angular/core/testing';

import { TransFormDateService } from './trans-form-date.service';

describe('TransFormDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransFormDateService = TestBed.get(TransFormDateService);
    expect(service).toBeTruthy();
  });
});
