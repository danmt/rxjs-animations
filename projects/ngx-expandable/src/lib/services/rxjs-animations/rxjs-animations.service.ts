import { Injectable } from '@angular/core';
import { defer, interval, animationFrameScheduler } from 'rxjs';
import { map, takeWhile, distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class RxjsAnimationsService {
  constructor() {}

  private ease(x: number) {
    return x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
  }

  duration = (t: number) => {
    return defer(() => {
      const t0 = Date.now();
      return interval(0, animationFrameScheduler).pipe(
        map(() => Date.now()),
        map(t1 => t1 - t0),
        map((dt: number) => dt / t),
        takeWhile(n => n <= 1)
      );
    });
  };

  distance = (x: number, t: number) => {
    return this.duration(t).pipe(map((t: number) => this.ease(t) * x));
  };

  expand(current: number, max: number, t: number) {
    return this.distance(max - current, t).pipe(
      map((x: number) => Math.ceil(current + x)),
      distinctUntilChanged()
    );
  }

  collapse(current: number, min: number, t: number) {
    return this.distance(current - min, t).pipe(
      map((x: number) => Math.floor(current - x)),
      distinctUntilChanged()
    );
  }
}
