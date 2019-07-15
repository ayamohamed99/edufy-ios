import { TestBed } from '@angular/core/testing';

import { AttendanceTeachersService } from './attendance-teachers.service';

describe('AttendanceTeachersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttendanceTeachersService = TestBed.get(AttendanceTeachersService);
    expect(service).toBeTruthy();
  });
});
