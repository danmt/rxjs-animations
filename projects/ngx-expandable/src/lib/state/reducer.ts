import { State } from '../interfaces/state.interface';
import { Action } from '../interfaces/action.interface';
import { ActionTypes } from '../enums/action-types.enum';
import { ToggleTypes } from '../enums/toggle-types.enum';

export const reducer = (state: State, action: Action) => {
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
        distance: action.payload,
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
