import { ElementRef, EventEmitter, AfterViewInit, HostListener, Directive, Output, Input, Renderer2, Inject } from "@angular/core"
import { Observable } from "rxjs/Observable"
import { FormPostResponse } from "./dtos";
import { FormGroup } from "@angular/forms";
import { SelectUploadFileComponent } from "./select-upload-file.component";
import { HttpClient } from "@angular/common/http";

/*
 * This directive is used to decorate a form that contains the 'select-upload-file.component'.
 * The directive and component together allow for the uploading of multiple files along with any other form json data in the same
 * form post while being compatible with IE9 (by using a hidden iframe for the form submission).
 */

@Directive({
  selector: '[uploadFilesForm]'
})
export class UploadFilesFormDirective implements AfterViewInit {
  
  private supportsFormData: boolean;
  private finalEndpoint: string;
  private iFrameEl: any;
  //private formModelJsonHiddenField: ElementRef;
  
  @Input() fileSelector: SelectUploadFileComponent;
  @Input() theForm: FormGroup; 
  @Output() onFormSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() onPostResponseReceived: EventEmitter<FormPostResponse> = new EventEmitter<FormPostResponse>();
  @Output() onPostErrorResponseReceived: EventEmitter<any> = new EventEmitter<any>();
  

  @HostListener('submit', ['$event']) _onSubmitCallback(event:any)
  {
    this.onFormSubmit.emit();

    if (!this.supportsFormData) {
      // post form to hidden iFrame (for legacy browsers such as IE9)
      // when posting to the iframe, we need to pass any authentication and other custom headers by embedding them inside the form body (hidden inputs) and then intercepting and putting them in the headers via a custom action filter
      this.formRef.nativeElement.submit(); 
    }
    else {
      // post form via ajax
      event.preventDefault();

      let formData = new FormData();
      let result = Object.assign({}, this.theForm.value);
      for (let o in result) {
        formData.append(o, result[o]);
      }

      for (let j = 0; j < this.fileSelector.fileInputsList.length; j++) {
        const file = this.fileSelector.fileInputsList[j].files[0];
        formData.append('file', file);
      }

      const apiFullUrl = `${this.baseApiUrl}${this.finalEndpoint}`;
      
      // make the api http request
      this.http.post(apiFullUrl, formData).subscribe((response:FormPostResponse) => {
        this.onPostResponseReceived.emit(response);
      }, error => {
        this.onPostErrorResponseReceived.emit(error);
      });
    }
  }

  constructor(
    private formRef: ElementRef, // the form element (host of this directive)
    private renderer: Renderer2,
    private http: HttpClient,
    @Inject('BASE_API_URL') private baseApiUrl: string)
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

      // set form target (the form will post to the iframe)
      this.renderer.setAttribute(this.formRef.nativeElement, "target", iFrameName);
      
      this.renderer.listen(this.iFrameEl, "load", (event: any) => {
        this.handleIFramePostResponse();
      });

      // append the iframe to the form's parent element 
      const formParentRootEl = this.renderer.parentNode(this.formRef.nativeElement);
      this.renderer.appendChild(formParentRootEl, this.iFrameEl);
    }

  }

  private handleIFramePostResponse() {
    // parses the response from the hidden iframe
    try {
      const responseObj: FormPostResponse = this.parseIFramePostResponse();
      if (!responseObj)
        return;
      
        //const escapedJsonStr = responseObj.someJson.replace(/\\\"/g, "\"");
        //const someJsonObj: any = JSON.parse(escapedJsonStr);

        this.onPostResponseReceived.emit(responseObj);
    }
    catch (e) {
      const errorMsg = 'error parsing iframe response, ex: ' + e.message;
      this.onPostErrorResponseReceived.emit(errorMsg);
    }
  }

  private parseIFramePostResponse(): FormPostResponse {
    const responseJsonStr = this.iFrameEl.contentWindow.document.body.innerText;
    if (!responseJsonStr || responseJsonStr.length == 0)
      return null;
    const response: FormPostResponse = JSON.parse(responseJsonStr);
    return response;
  }
  
}
