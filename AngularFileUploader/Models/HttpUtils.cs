using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace AngularFileUploader.Models
{
    public class HttpUtils
    {
        static async Task<Tuple<string, HttpStatusCode, bool, string>> PostWithFiles(string endpointUrl, List<KeyValuePair<string, string>> valuesToPost, List<IFormFile> filesToUpload)
        {
            using (var multipartContent = new MultipartFormDataContent())
            {
                // add values to post
                foreach (var keyValPair in valuesToPost)
                {
                    multipartContent.Add(new StringContent(keyValPair.Value), keyValPair.Key);
                }

                // add files to upload
                foreach (var file in filesToUpload)
                {
                    var stream = file.OpenReadStream();
                    var content = new StreamContent(stream);

                    content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("form-data")
                    {
                        Name = "attachment",
                        FileName = Path.GetFileName(file.FileName)
                    };

                    multipartContent.Add(content);
                }

                // post data to endpoint
                using (var client = new HttpClient())
                {
                    // add any custom headers to the http request
                    //foreach (var customHeader in customHeaders)
                    //client.DefaultRequestHeaders.Add(customHeader.Key, header.Value);

                    HttpResponseMessage responseMessage = await client.PostAsync(endpointUrl, multipartContent);

                    var responseContent = await responseMessage.Content.ReadAsStringAsync();

                    return new Tuple<string, HttpStatusCode, bool, string>(
                        responseContent,
                        responseMessage.StatusCode,
                        responseMessage.IsSuccessStatusCode,
                        responseMessage.ReasonPhrase);
                }
            }
        }
    }
}
