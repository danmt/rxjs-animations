import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpandableRoutingModule } from './expandable-routing.module';
import { ExpandableComponent } from './expandable.component';
import { NgxExpandableModule } from 'ngx-expandable';
import { ItemComponent } from './components/item/item.component';

@NgModule({
  declarations: [ExpandableComponent, ItemComponent],
  imports: [CommonModule, NgxExpandableModule, ExpandableRoutingModule]
})
export class ExpandableModule {}
