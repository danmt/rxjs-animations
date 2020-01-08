import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxExpandableComponent } from 'ngx-expandable';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss']
})
export class ExpandableComponent implements OnInit {
  @ViewChild(NgxExpandableComponent, { static: true }) expandable: any;
  expanded$: Observable<boolean>;
  collapsed$: Observable<boolean>;
  inProgress$: Observable<boolean>;
  expanding$: Observable<boolean>;
  collapsing$: Observable<boolean>;
  collapsedHeight = 40;
  expandedHeight = 400;

  constructor() {}

  ngOnInit() {
    this.expanded$ = this.expandable.expanded$;
    this.collapsed$ = this.expandable.collapsed$;
    this.inProgress$ = this.expandable.inProgress$;
    this.expanding$ = this.expandable.expanding$;
    this.collapsing$ = this.expandable.collapsing$;
  }
}
