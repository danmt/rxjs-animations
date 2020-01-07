import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandableDirective } from './directives/expandable.directive';

@NgModule({
  declarations: [ExpandableDirective],
  imports: [CommonModule],
  exports: [ExpandableDirective]
})
export class SharedModule {}
