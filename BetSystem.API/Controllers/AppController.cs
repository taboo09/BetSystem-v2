using System; 
using System.Collections.Generic; 
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Threading.Tasks; 
using BetSystem.API.Models; 
using BetSystem.API.Persistence.Core; 
using Microsoft.AspNetCore.Mvc; 

namespace BetSystem.API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AppController:ControllerBase {
        private readonly IAppRepository _appRepository; 
        private readonly IUnitOfWork _unitOfWork; 

        public AppController(IAppRepository appRepository, IUnitOfWork unitOfWork) {
            _unitOfWork = unitOfWork; 
            _appRepository = appRepository; 
        }

        //GET api/values
        [HttpGet]
        public async Task<ActionResult> Get() 
        {
            return Ok(await _appRepository.FindLast<AppVersion>()); 
        }

        // [HttpGet]
        // public ActionResult GetVersion()
        // {
        //     // var version =  Assembly.GetEntryAssembly()
        //     //     .GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion;
        //     var version = System.Reflection.Assembly.GetEntryAssembly().GetName().Version;

        //     return Ok(version);
        // } 
           

        // http://localhost:5055/api/app?v=2.0.1
        [HttpPost]
        public async Task<ActionResult> Save(string v) 
        {
            if (v == null) return BadRequest($"Version is not valid."); 

            var newVersion = new AppVersion() {
                Value = v, 
                Date = DateTime.Now
            }; 

            _appRepository.Add<AppVersion>(newVersion);
            await _unitOfWork.SaveAll();

            return Ok($"New app version, {v}, has been set up."); 
        }

        [HttpGet("credentials")]
        public ActionResult GetCredentials()
        {
            bool isWindows = System.Runtime.InteropServices.RuntimeInformation
                                               .IsOSPlatform(OSPlatform.Windows);
                                               
            var credentials = isWindows ? WindowsIdentity.GetCurrent().Name.Split("\\") : null;
            
            var user = credentials != null ? new { pc = credentials[0], name = credentials[1] } : 
                new { pc = "unknown", name = "unknown" };

            return Ok(user);
        }
    }
}
