import { TestBed } from '@angular/core/testing';

import { CheckboxFunctionService } from './checkbox-function.service';

describe('CheckboxFunctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckboxFunctionService = TestBed.get(CheckboxFunctionService);
    expect(service).toBeTruthy();
  });
});
