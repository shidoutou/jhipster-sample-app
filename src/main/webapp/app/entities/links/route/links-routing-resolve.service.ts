import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILinks, Links } from '../links.model';
import { LinksService } from '../service/links.service';

@Injectable({ providedIn: 'root' })
export class LinksRoutingResolveService implements Resolve<ILinks> {
  constructor(protected service: LinksService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILinks> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((links: HttpResponse<Links>) => {
          if (links.body) {
            return of(links.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Links());
  }
}
