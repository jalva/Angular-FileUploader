import { Component, ElementRef, ViewChild, Output, EventEmitter, Renderer2, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'

/*
 * This component should be inside a form decorated with an attribute directive
 * 'form-with-upload-files' directive which works together with this component
*/

@Component({
  selector: 'select-upload-file',
  templateUrl: './select-upload-file.component.html',
  styleUrls: ['./select-upload-file.component.scss']
})
export class SelectUploadFileComponent implements AfterViewInit
{
  @ViewChild('filesContainer') filesContainerEl: ElementRef;
  @Input() disabled: boolean;
  @Input() addFileBttnLabel: string;
  @Output() onFileSelectEvent: EventEmitter<File> = new EventEmitter<File>();
  public fileInputsList: any[] = [];
  protected fileUploadEl: ElementRef;
  private _activeInputEl: any;

  constructor(
    private _renderer: Renderer2
  ) {

  }

  ngAfterViewInit() {
    this._activeInputEl = this.newFileInputEl();
    this._renderer.appendChild(this.filesContainerEl.nativeElement, this._activeInputEl);
  }

  public addFile() {
    this._activeInputEl.click();
  }

  // callback for when user selects a file
  public onFileAdded() {
    const file = this._activeInputEl.files[0];
    this.fileInputsList.push(this._activeInputEl);
    this._activeInputEl = this.newFileInputEl();
    this._renderer.appendChild(this.filesContainerEl.nativeElement, this._activeInputEl);

    if (this.onFileSelectEvent)
      this.onFileSelectEvent.next(file);
  }

  public deleteFile(index: number): void {
    const oldEl = this.fileInputsList.splice(index, 1)[0];
    this._renderer.removeChild(this.filesContainerEl.nativeElement, oldEl);
  }

  public clearFiles() {
    for (let i = 0; i < this.fileInputsList.length; i++) {
      const childEl = this.fileInputsList[i];
      this._renderer.removeChild(this.filesContainerEl.nativeElement, childEl);
    }
    this.fileInputsList = [];
  }

  public getFileName(fullPath: string) {
    return fullPath.substring(fullPath.lastIndexOf("\\") + 1);
  }

  private newFileInputEl(): any {
    const newEl = this._renderer.createElement("input");
    this._renderer.setAttribute(newEl, "type", "file");
    this._renderer.setAttribute(newEl, "name", "file" + (new Date().getTime()));
    this._renderer.setStyle(newEl, "display", "none");
    this._renderer.listen(newEl, "change", el => this.onFileAdded());

    return newEl;
  }
}
