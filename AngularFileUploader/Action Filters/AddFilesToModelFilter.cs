using AngularFileUploader.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularFileUploader.Action_Filters
{
    /// <summary>
    /// Action filter used to initialize the uploaded files inside the model passed to the action method (instead of doing it directly in the action method). An alternative would be to do this inside a custom model binder, however since we're only interested in initializing the files we can just grab the final model here (already model bound by the framework) and just add the files to it.
    /// </summary>
    public class AddFilesToModelFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var model = context.ActionArguments.Values.First() as SampleFormPostModel;

            for (var i = 0; i < context.HttpContext.Request.Form.Files.Count; i++)
            {
                var file = context.HttpContext.Request.Form.Files[i];
                model.UploadedFiles.Add(file);
            }

            base.OnActionExecuting(context);
        }
    }
}
