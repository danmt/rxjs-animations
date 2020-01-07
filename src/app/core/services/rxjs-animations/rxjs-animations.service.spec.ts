import { TestBed } from '@angular/core/testing';

import { RxjsAnimationsService } from './rxjs-animations.service';

describe('RxjsAnimationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RxjsAnimationsService = TestBed.get(RxjsAnimationsService);
    expect(service).toBeTruthy();
  });
});
