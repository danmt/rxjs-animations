import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpandableComponent } from './expandable.component';

const routes: Routes = [{ path: '', component: ExpandableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpandableRoutingModule {}
