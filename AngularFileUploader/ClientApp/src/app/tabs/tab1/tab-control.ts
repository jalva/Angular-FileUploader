import { Component } from '@angular/core';
import { Tab1 } from './tab';

@Component({
  selector: 'tabs1',
  template: `
    <ul class="nav nav-tabs">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)">
        <a>{{tab.tabTitle}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  `
})

export class Tabs1 {
  tabs: Tab1[] = [];

  addTab(tab: Tab1) {
    if (this.tabs.length == 0)
      tab.active = true;
    this.tabs.push(tab);
  }

  selectTab(tab: Tab1) {
    console.log(tab.tabTitle + ' selected');
    this.tabs.forEach(t => t.active = false);
    tab.active = true;
  }
}
