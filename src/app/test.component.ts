import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'name',
  template: '<a (click)="click()">Click acá</a>'
})
export class NameComponent {
  constructor(private router: Router) {}

  click() {
    this.router.navigate(['/some_route']);
  }
}
