import { TestBed } from '@angular/core/testing';

import { ToastViewService } from './toast-view.service';

describe('ToastViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastViewService = TestBed.get(ToastViewService);
    expect(service).toBeTruthy();
  });
});
