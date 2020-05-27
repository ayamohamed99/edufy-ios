import { TestBed } from '@angular/core/testing';

import { TemplateFunctionsService } from './template-functions.service';

describe('TemplateFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateFunctionsService = TestBed.get(TemplateFunctionsService);
    expect(service).toBeTruthy();
  });
});
