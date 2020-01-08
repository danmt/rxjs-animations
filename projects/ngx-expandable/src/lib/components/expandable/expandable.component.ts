import { Component, OnInit, Input } from '@angular/core';
import { Subject, merge } from 'rxjs';
import {
  scan,
  shareReplay,
  filter,
  withLatestFrom,
  map,
  switchMap,
  distinctUntilChanged
} from 'rxjs/operators';
import { RxjsAnimationsService } from '../../services/rxjs-animations/rxjs-animations.service';
import { State } from '../../interfaces/state.interface';
import { Status } from '../../interfaces/status.interface';
import { ToggleTypes } from '../../enums/toggle-types.enum';
import { ActionTypes } from '../../enums/action-types.enum';
import { Action } from '../../interfaces/action.interface';
import { reducer } from '../../state/reducer';
import { initialState } from '../../state/initial-state';

@Component({
  selector: 'ngx-expandable',
  template: `
    <div
      ngxExpandable
      (click)="clicked()"
      [distance]="distance$ | async"
      style="overflow: hidden"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class NgxExpandableComponent implements OnInit {
  @Input() collapsedHeight: number;
  @Input() expandedHeight: number;
  @Input() delayTime = 1000;

  // State
  private readonly dispatcher = new Subject();
  private readonly actions$ = this.dispatcher.asObservable();
  private readonly state$ = this.actions$.pipe(
    scan(
      (state: State, action: Action) => reducer(state, action),
      initialState
    ),
    shareReplay(1)
  );

  // Effects
  private readonly init$ = this.actions$.pipe(
    filter((action: Action) => action.type === ActionTypes.Init),
    withLatestFrom(this.state$, (_, { collapsedHeight }) => collapsedHeight),
    map((collapsedHeight: number) => ({
      type: 'move',
      payload: collapsedHeight
    }))
  );
  private readonly toggle$ = this.actions$.pipe(
    filter((action: Action) => action.type === ActionTypes.Toggle),
    withLatestFrom(this.state$, (_, state: State) => state),
    switchMap(({ toggleType, distance }: State) =>
      this.toggle(toggleType, distance)
    ),
    map((distance: number) => ({ type: ActionTypes.Move, payload: distance }))
  );

  // Selectors
  readonly status$ = this.state$.pipe(
    map(
      ({ inProgress, toggleType, expanded, collapsed }: State) =>
        ({
          inProgress,
          toggleType,
          expanded,
          collapsed
        } as Status)
    ),
    shareReplay(1)
  );
  readonly distance$ = this.state$.pipe(
    map(({ distance }: State) => distance),
    distinctUntilChanged(),
    shareReplay(1)
  );
  readonly expanding$ = this.status$.pipe(
    map(
      ({ inProgress, toggleType, expanded }: Status) =>
        inProgress && !expanded && toggleType === ToggleTypes.Expand
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );
  readonly collapsing$ = this.status$.pipe(
    map(
      ({ inProgress, toggleType, collapsed }: Status) =>
        inProgress && !collapsed && toggleType === ToggleTypes.Collapse
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );
  readonly expanded$ = this.status$.pipe(
    map(({ expanded }: Status) => expanded),
    distinctUntilChanged(),
    shareReplay(1)
  );
  readonly collapsed$ = this.status$.pipe(
    map(({ collapsed }: Status) => collapsed),
    distinctUntilChanged(),
    shareReplay(1)
  );
  readonly inProgress$ = this.status$.pipe(
    map(({ inProgress }: Status) => inProgress),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(private animationsService: RxjsAnimationsService) {}

  ngOnInit() {
    merge(this.init$, this.toggle$).subscribe(this.dispatcher);

    this.dispatcher.next({
      type: ActionTypes.Init,
      payload: {
        collapsedHeight: this.collapsedHeight,
        expandedHeight: this.expandedHeight,
        distance: this.collapsedHeight
      }
    });
  }

  clicked() {
    this.dispatcher.next({ type: ActionTypes.Toggle });
  }

  private toggle(toggleType: ToggleTypes, distance: number) {
    return toggleType === ToggleTypes.Expand
      ? this.animationsService.expand(
          distance,
          this.expandedHeight,
          this.delayTime
        )
      : this.animationsService.collapse(
          distance,
          this.collapsedHeight,
          this.delayTime
        );
  }
}
