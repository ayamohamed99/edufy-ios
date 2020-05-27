import { TestBed } from '@angular/core/testing';

import { DailyReportService } from './daily-report.service';

describe('DailyReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyReportService = TestBed.get(DailyReportService);
    expect(service).toBeTruthy();
  });
});
