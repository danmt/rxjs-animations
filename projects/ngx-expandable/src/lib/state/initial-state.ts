import { State } from '../interfaces/state.interface';
import { ToggleTypes } from '../enums/toggle-types.enum';

export const initialState: State = {
  expanded: false,
  collapsed: false,
  distance: 0,
  inProgress: false,
  toggleType: ToggleTypes.Collapse,
  collapsedHeight: 0,
  expandedHeight: 0
};
