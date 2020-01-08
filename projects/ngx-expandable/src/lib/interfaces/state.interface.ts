import { ToggleTypes } from '../enums/toggle-types.enum';

export interface State {
  expanded: boolean;
  collapsed: boolean;
  distance: number;
  inProgress: boolean;
  toggleType: ToggleTypes;
  collapsedHeight: number;
  expandedHeight: number;
}
