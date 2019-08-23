import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { Tabs1 } from './tabs/tab1/tab-control';
import { Tab1 } from './tabs/tab1/tab';
import { FormWithFileUploadsExample } from './file-uploader/form-with-file-uploads-example.component';
import { SelectUploadFileComponent } from './file-uploader/select-upload-file.component';
import { UploadFilesFormDirective } from './file-uploader/upload-files-form.directive';
import { ModalModule } from 'ngx-bootstrap/modal'; //"npm install ngx-bootstrap@2.0.5 --save"

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    Tabs1,
    Tab1,
    SelectUploadFileComponent,
    UploadFilesFormDirective,
    FormWithFileUploadsExample
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      {path: 'file-upload', component: FormWithFileUploadsExample}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
