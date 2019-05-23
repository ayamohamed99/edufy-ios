import { TestBed } from '@angular/core/testing';

import { BackgroundNotificationService } from './background-notification.service';

describe('BackgroundNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackgroundNotificationService = TestBed.get(BackgroundNotificationService);
    expect(service).toBeTruthy();
  });
});
