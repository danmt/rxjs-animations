import { ToggleTypes } from '../enums/toggle-types.enum';

export interface Status {
  expanded: boolean;
  collapsed: boolean;
  inProgress: boolean;
  toggleType: ToggleTypes;
}
