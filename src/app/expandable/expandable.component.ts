import { Component } from '@angular/core';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss']
})
export class ExpandableComponent {
  collapsedHeight = 40;
  expandedHeight = 200;
  items = [
    {
      title: 'item #1',
      description: 'this is the description for the first item in the list'
    },
    {
      title: 'item #2',
      description: 'this is the description for the second item in the list'
    },
    {
      title: 'item #3',
      description: 'this is the description for the third item in the list'
    }
  ];
}
