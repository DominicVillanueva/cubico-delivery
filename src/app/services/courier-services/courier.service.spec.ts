import { TestBed } from '@angular/core/testing';

import { CourierService } from './courier.service';

describe('UsersService', () => {
  let service: CourierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
