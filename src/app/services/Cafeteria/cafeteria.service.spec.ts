import { TestBed } from '@angular/core/testing';

import { CafeteriaService } from './cafeteria.service';

describe('CafeteriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CafeteriaService = TestBed.get(CafeteriaService);
    expect(service).toBeTruthy();
  });
});
