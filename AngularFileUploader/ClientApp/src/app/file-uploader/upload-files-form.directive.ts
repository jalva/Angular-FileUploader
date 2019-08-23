import { ElementRef, EventEmitter, AfterViewInit, HostListener, Directive, Output, Input, Renderer2 } from "@angular/core"
import { Observable } from "rxjs/Observable"
import { FormPostResponse } from "./dtos";
import { FormGroup } from "@angular/forms";
import { SelectUploadFileComponent } from "./select-upload-file.component";

/*
 * This directive is used to decorate a form that contains the 'select-upload-file.component'.
 * The directive and component together allow for the uploading of multiple files along with any other form json data in the same
 * form post while being compatible with IE9 (by using a hidden iframe for the form submission).
 */

@Directive({
  selector: '[uploadFilesForm]'
})
export class UploadFilesFormDirective implements AfterViewInit {
  
  private iFrameEl: any;
  //private formModelJsonHiddenField: ElementRef;
  private legacyBrowserPassThroughEndpoint: string;
  private finalEndpoint: string;
  private supportsFormData: boolean;
  
  @Input() fileSelector: SelectUploadFileComponent;

  @Input() theForm: FormGroup; 
  @Output() onFormSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() onPostResponseReceived: EventEmitter<FormPostResponse> = new EventEmitter<FormPostResponse>();
  @Output() onPostErrorResponseReceived: EventEmitter<any> = new EventEmitter<any>();
  

  @HostListener('submit', ['$event']) _onSubmitCallback(event:any)
  {
    // create the hidden field with the json payload
    /*
    if (this.formModelJsonHiddenField == null) {
      this.formModelJsonHiddenField = this.renderer.createElement("input");
      this.renderer.setProperty(this.formModelJsonHiddenField, "type", "hidden");
      this.renderer.setProperty(this.formModelJsonHiddenField, "name", "formModelJson");
      this.renderer.appendChild(this.formRef.nativeElement, this.formModelJsonHiddenField);
    }

    let formModelJson = "";
    if (this.formModel && typeof (this.formModel) == "object") {
      formModelJson = JSON.stringify(this.formModel);
    }
    this.renderer.setProperty(this.formModelJsonHiddenField, "value", formModelJson);
    */

    this.onFormSubmit.emit();

    if (!this.supportsFormData) {
      this.formRef.nativeElement.submit();
    }
    else {
      event.preventDefault();

      let formData = new FormData();
      let result = Object.assign({}, this.theForm.value);
      for (let o in result) {
        formData.append(o, result[o]);
      }

      for (let j = 0; j < this.fileSelector.fileInputsList.length; j++) {
        const file = this.fileSelector.fileInputsList[j].files[0];
        formData.append('file', file);
        console.log(`appended file ${file.name} to formData`)
      }
    }
  }

  constructor(
    private formRef: ElementRef, // the form element (host of this directive)
    private renderer: Renderer2)
  {
    const winRef: any = window;
    this.supportsFormData = !!winRef.FormData; // feature detection for FormData
  }

  ngAfterViewInit()
  {
    // initialize the form's method and enctype attributes
    this.renderer.setAttribute(this.formRef.nativeElement, "method", "post");
    this.renderer.setAttribute(this.formRef.nativeElement, "enctype", "multipart/form-data");

    this.finalEndpoint = this.formRef.nativeElement.getAttribute('action');

    // if legacy browser then do some additional form initialization
    if (!this.supportsFormData)
    {
      // create iframe
      const iFrameName = "form_submit_iframe" + (new Date().getTime());

      this.iFrameEl = this.renderer.createElement("iframe");
      this.renderer.setAttribute(this.iFrameEl, "name", iFrameName);

      // set form action and target (the form will post to the iframe)
      this.renderer.setAttribute(this.formRef.nativeElement, "action", this.legacyBrowserPassThroughEndpoint);
      this.renderer.setAttribute(this.formRef.nativeElement, "target", iFrameName);

      // render the final endpoint url hidden input
      const finalEndpointHiddenField = this.renderer.createElement("input");
      this.renderer.setProperty(finalEndpointHiddenField, "type", "hidden");
      this.renderer.setProperty(finalEndpointHiddenField, "name", "forwardToUrl");
      this.renderer.setProperty(finalEndpointHiddenField, "value", this.finalEndpoint);
      this.renderer.appendChild(this.formRef.nativeElement, finalEndpointHiddenField);

      this.renderer.listen(this.iFrameEl, "load", (event: any) => {
        this.handleFormPostResponse();
      });

      // append the iframe to the form's parent element 
      const formParentRootEl = this.renderer.parentNode(this.formRef.nativeElement);
      this.renderer.appendChild(formParentRootEl, this.iFrameEl);
    }

  }

  private handleFormPostResponse() {
    // parses the response from the hidden iframe
    try {
      const responseObj: FormPostResponse = this.parseFormSubmitResponse();
      if (!responseObj)
        return;
      if (responseObj.IsSubmittedToApi == true) {
        this.onPostResponseReceived.emit(responseObj);
      }
      else if (responseObj.ErrorSubmittingToApi) {
        this.onPostErrorResponseReceived.emit(responseObj.ErrorSubmittingToApi);
      }
      else {
        const escapedResponse = responseObj.ResponseFromApi.replace(/\\\"/g, "\"");
        const errorFromApi: any = JSON.parse(escapedResponse);
        this.onPostErrorResponseReceived.emit(errorFromApi);
      }
    }
    catch (e) {
      console.log('exception during iframe response parsing, ex: ' + e.message);
    }
  }

  private parseFormSubmitResponse(): FormPostResponse {
    const responseJsonStr = this.iFrameEl.contentWindow.document.body.innerText;
    if (!responseJsonStr || responseJsonStr.length == 0)
      return null;
    const responseJsonObj: FormPostResponse = JSON.parse(responseJsonStr);
    const response = new FormPostResponse();
    Object.assign(response, responseJsonObj);
    return response;
  }
  
}
