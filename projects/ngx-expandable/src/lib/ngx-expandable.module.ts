import { NgModule } from '@angular/core';
import { NgxExpandableComponent } from './components/expandable/expandable.component';
import { NgxExpandableDirective } from './directives/expandable/expandable.directive';
import { RxjsAnimationsService } from './services/rxjs-animations.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgxExpandableComponent, NgxExpandableDirective],
  providers: [RxjsAnimationsService],
  imports: [CommonModule],
  exports: [NgxExpandableComponent, NgxExpandableDirective]
})
export class NgxExpandableModule {}
