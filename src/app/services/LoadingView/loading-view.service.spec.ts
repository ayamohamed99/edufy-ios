import { TestBed } from '@angular/core/testing';

import { LoadingViewService } from './loading-view.service';

describe('LoadingViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingViewService = TestBed.get(LoadingViewService);
    expect(service).toBeTruthy();
  });
});
