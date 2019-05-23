import { TestBed } from '@angular/core/testing';

import { FCMService } from './fcm.service';

describe('FCMService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FCMService = TestBed.get(FCMService);
    expect(service).toBeTruthy();
  });
});
