import { TestBed } from '@angular/core/testing';

import { MydataserviceService } from './mydataservice.service';

describe('MydataserviceService', () => {
  let service: MydataserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MydataserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
