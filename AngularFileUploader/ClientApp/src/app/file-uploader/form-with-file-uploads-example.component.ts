import { SelectUploadFileComponent } from "./select-upload-file.component";
import { Component, ViewChild, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FileUploadApiError, ExampleFormPostModel } from "./dtos";

@Component({
  selector: "form-with-file-uploads-example",
  templateUrl: "./form-with-file-uploads-example.component.html",
  styleUrls: ["./form-with-file-uploads-example.component.css"]
})
export class FormWithFileUploadsExample implements OnInit
{

  @ViewChild(SelectUploadFileComponent)
  private _uploadFileSelector: SelectUploadFileComponent;

  @ViewChild('cancelModalConf')
  private _cancelModalConfTemplate: TemplateRef<any>;

  private _cancelModalRef: BsModalRef;

  public sampleForm: FormGroup;
  public someFormField1: FormControl;

  public formPostSuccessMessageHtml: string;
  public formPostErrorMessageHtml: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalSvc: BsModalService,
  )
  {
    this.someFormField1 = new FormControl('someVal1', [Validators.required, Validators.maxLength(50)]);
  }

  ngOnInit() {
    this.buildForm();

  }

  private buildForm(): void {
    this.sampleForm = this._formBuilder.group({
      someFormValue1: this.someFormField1
    });
  }
  

  private clearForm(): void {
    this.sampleForm.reset({
      someFormValue1: "Default val 1"
    });
    // clear upload files
    this._uploadFileSelector.clearFiles();

    // clear any status messages
    this.formPostSuccessMessageHtml = "";
    this.formPostErrorMessageHtml = "";
  }

  public buildFormModel(): ExampleFormPostModel {
    let model = new ExampleFormPostModel();
    model.someProperty = this.sampleForm.get('someFormValue1').value;
    return model;
  }

  public onFormSubmit(): any {

  }

  public cancelClick() {
    this._cancelModalRef = this._modalSvc.show(this._cancelModalConfTemplate);
  }

  public isFormValid() {
    return this.sampleForm.valid;
  }

  public successFormPostCallback($event) {

  }

  public errorFormPostCallback(error: FileUploadApiError | string) {
    
  }

  public decline() {
    this._cancelModalRef.hide();
  }

  public confirm() {
    this._cancelModalRef.hide();
    this.clearForm();
  }
}

