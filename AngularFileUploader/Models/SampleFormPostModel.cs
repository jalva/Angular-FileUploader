using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularFileUploader.Models
{
    public class SampleFormPostModel
    {
        public SampleFormPostModel()
        {
            UploadedFiles = new List<IFormFile>();
        }

        public string SomeFormValue1 { get; set; }
        public List<IFormFile> UploadedFiles { get; set; }
    }
}
