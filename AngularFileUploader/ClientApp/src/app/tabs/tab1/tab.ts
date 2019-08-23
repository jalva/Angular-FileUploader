import { Component, Input, OnInit } from '@angular/core';
import { Tabs1 } from './tab-control';

@Component({
  selector: 'tab1',
  template: `
    <div [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `
})

export class Tab1 implements OnInit{

  @Input() tabTitle: string;
  active: boolean = false;

  constructor(tabs: Tabs1) {
    tabs.addTab(this);
  }

  ngOnInit(): void {
    console.log(this.tabTitle);
  }
  
}
