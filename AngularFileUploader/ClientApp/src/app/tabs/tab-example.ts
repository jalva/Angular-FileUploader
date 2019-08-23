import { Tabs1 } from './tab1/tab-control';
import { Tab1 } from './tab1/tab';
import { Component } from '@angular/core';

@Component({
  selector: 'tab-example',
  template: `
    <h2>Tabs Example 1</h2>
    <tabs1>
      <tab1 tabTitle="Tab1">
        Content 1
      </tab1>
      <tab1 tabTitle="Tab2">
        Content 2
      </tab1>
    </tabs1>

    <h2>Tabs Example 2</h2>
    <tabs1>
      <tab1 tabTitle="Tab1">
        Content 1
      </tab1>
      <tab1 tabTitle="Tab2">
        Content 2
      </tab1>
    </tabs1>
  `
})

export class TabsExample {}
