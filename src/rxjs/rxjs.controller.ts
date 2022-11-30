import { Controller, Get } from '@nestjs/common';
import { map, of, switchMap } from 'rxjs';

@Controller('rxjs')
export class RxjsController {
  @Get('/of')
  operatorOf() {
    return of([{ name: 'arkadi' }]);
  }

  @Get('/map')
  operatorMap() {
    of(1, 2, 3)
      .pipe(
        map((x) => {
          // debug
          return x * x;
        }),
      )
      .subscribe((v) => {
        // debug
        console.log(`value: ${v}`);
      });
  }

  @Get('/switch-map')
  operatorSwitchMap() {
    const switched = of(1, 2, 3).pipe(
      switchMap((x) => {
        // debug
        return of(x, x ** 2, x ** 3);
      }),
    );
    switched.subscribe((x) => {
      // debug
      console.log(x);
    });
  }
}
