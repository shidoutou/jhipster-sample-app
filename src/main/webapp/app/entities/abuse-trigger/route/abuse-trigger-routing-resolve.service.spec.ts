import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAbuseTrigger, AbuseTrigger } from '../abuse-trigger.model';
import { AbuseTriggerService } from '../service/abuse-trigger.service';

import { AbuseTriggerRoutingResolveService } from './abuse-trigger-routing-resolve.service';

describe('AbuseTrigger routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AbuseTriggerRoutingResolveService;
  let service: AbuseTriggerService;
  let resultAbuseTrigger: IAbuseTrigger | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(AbuseTriggerRoutingResolveService);
    service = TestBed.inject(AbuseTriggerService);
    resultAbuseTrigger = undefined;
  });

  describe('resolve', () => {
    it('should return IAbuseTrigger returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAbuseTrigger = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAbuseTrigger).toEqual({ id: 123 });
    });

    it('should return new IAbuseTrigger if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAbuseTrigger = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAbuseTrigger).toEqual(new AbuseTrigger());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AbuseTrigger })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAbuseTrigger = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAbuseTrigger).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
