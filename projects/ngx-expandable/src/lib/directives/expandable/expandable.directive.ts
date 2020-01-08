import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ngxExpandable]'
})
export class NgxExpandableDirective {
  _distance: number;
  @Input() set distance(x: number) {
    this.renderer.setStyle(this.el.nativeElement, 'height', `${x}px`);
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}
}
