import { TestBed } from '@angular/core/testing';

import { ExportOptionService } from './export-option.service';

describe('ExportOptionService', () => {
  let service: ExportOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
