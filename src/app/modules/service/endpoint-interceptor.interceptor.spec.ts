import { TestBed } from '@angular/core/testing';

import { EndpointInterceptorInterceptor } from './endpoint-interceptor.interceptor';

describe('EndpointInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EndpointInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: EndpointInterceptorInterceptor = TestBed.inject(EndpointInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
