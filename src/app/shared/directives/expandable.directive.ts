import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { Subject, merge } from 'rxjs';
import {
  map,
  switchMap,
  withLatestFrom,
  scan,
  shareReplay,
  filter,
  tap,
  distinctUntilChanged
} from 'rxjs/operators';
import { RxjsAnimationsService } from 'src/app/core/services/rxjs-animations/rxjs-animations.service';

enum ToggleTypes {
  Expand = 'expand',
  Collapse = 'collapse'
}

interface Status {
  expanded: boolean;
  collapsed: boolean;
  inProgress: boolean;
  toggleType: ToggleTypes;
}

interface State {
  expanded: boolean;
  collapsed: boolean;
  distance: number;
  inProgress: boolean;
  toggleType: ToggleTypes;
  collapsedHeight: number;
  expandedHeight: number;
}

const initialState: State = {
  expanded: false,
  collapsed: false,
  distance: 0,
  inProgress: false,
  toggleType: ToggleTypes.Collapse,
  collapsedHeight: 0,
  expandedHeight: 0
};

interface Action {
  type: string;
  payload?: any;
}

enum ActionTypes {
  Init = 'init',
  Toggle = 'toggle',
  Move = 'move',
  Moved = 'moved',
  Expanded = 'expanded',
  Collapsed = 'collapsed'
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.Init:
      return {
        ...state,
        ...action.payload
      };
    case ActionTypes.Toggle:
      return {
        ...state,
        expanded: false,
        collapsed: false,
        inProgress: true,
        toggleType:
          state.toggleType === ToggleTypes.Expand
            ? ToggleTypes.Collapse
            : ToggleTypes.Expand
      };
    case ActionTypes.Move:
      return {
        ...state,
        distance: action.payload
      };
    case ActionTypes.Moved:
      return {
        ...state,
        ...(state.toggleType === ToggleTypes.Expand
          ? action.payload === state.expandedHeight
            ? { expanded: true, inProgress: false }
            : {}
          : action.payload === state.collapsedHeight
          ? { collapsed: true, inProgress: false }
          : {})
      };
    default:
      return state;
  }
};

@Directive({
  selector: '[appExpandable]'
})
export class ExpandableDirective implements OnInit {
  @Input() collapsedHeight: number;
  @Input() expandedHeight: number;
  @Input() delayTime = 1000;
  @Output() expanded = new EventEmitter();
  @Output() collapsed = new EventEmitter();

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
  private readonly move$ = this.actions$.pipe(
    filter((action: Action) => action.type === ActionTypes.Move),
    tap(({ payload }: Action) =>
      this.renderer.setStyle(this.el.nativeElement, 'height', `${payload}px`)
    ),
    map(({ payload }: Action) => ({ type: 'moved', payload }))
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

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private animationsService: RxjsAnimationsService
  ) {}

  ngOnInit() {
    merge(this.init$, this.toggle$, this.move$).subscribe(this.dispatcher);

    this.dispatcher.next({
      type: ActionTypes.Init,
      payload: {
        collapsedHeight: this.collapsedHeight,
        expandedHeight: this.expandedHeight,
        distance: this.collapsedHeight
      }
    });
  }

  @HostListener('click')
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
