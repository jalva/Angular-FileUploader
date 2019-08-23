export class FileUploadApiError {

}

export class UploadedFileInfo {
  public fileName: string;
  public contentType: string;
  public contentLength: number;
}

export class ExampleFormPostModel {
  public someProperty: string;
}



export class FormPostResponse {
  public Files: UploadedFileInfo[];
  public IsSubmittedToApi: boolean;
  public ResponseFromApi: string;
  public ErrorSubmittingToApi: string;
  public StatusCode: string;
}

