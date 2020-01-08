import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() collapsedHeight: number;
  @Input() expandedHeight: number;
  @Input() expanding: boolean;
  @Input() collapsing: boolean;
  @Input() expanded: boolean;
}
