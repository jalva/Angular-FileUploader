using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using AngularFileUploader.Action_Filters;
using AngularFileUploader.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AngularFileUploader.Controllers
{
    [Route("api/file-upload")]
    public class FileUploadController : Controller
    {
        [HttpPost]
        [AddFilesToModelFilter]
        public IActionResult Index(SampleFormPostModel formModel)
        {
            var val = formModel.SomeFormValue1;
            var files = formModel.UploadedFiles;

            // do something with the posted values and uploaded files

            var response = new FormPostResponse
            {
                Message = $"Uploaded {formModel.UploadedFiles.Count} files",
                //SomeJsonStr = HttpUtility.JavaScriptStringEncode(someJsonStr)
            };
            
            return Ok(response);
        }
    }
}


