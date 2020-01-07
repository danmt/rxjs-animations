import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpandableRoutingModule } from './expandable-routing.module';
import { ExpandableComponent } from './expandable.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ExpandableComponent],
  imports: [CommonModule, SharedModule, ExpandableRoutingModule]
})
export class ExpandableModule {}
