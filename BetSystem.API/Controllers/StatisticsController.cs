using System.Linq;
using System.Threading.Tasks;
using BetSystem.API.Persistence.Core;
using Microsoft.AspNetCore.Mvc;

namespace BetSystem.API.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsRepository _statisticsRepository;
        public StatisticsController(IStatisticsRepository statisticsRepository)
        {
            _statisticsRepository = statisticsRepository;
        }

        // get team stats if id is provided or list of teams stats if id is null
        [HttpGet("{id?}")]
        public async Task<IActionResult> GetTeamsStatus(int? id)
        {
            var listTeamStatus = await _statisticsRepository.TeamStatus(id);

            if (listTeamStatus == null) return BadRequest("Team cannot be found");

            if (id != null)  return Ok(listTeamStatus.ToList()[0]);

            return Ok(listTeamStatus);
        }

        [HttpGet("dates")]
        public async Task<IActionResult> GetDateStatus()
        {
            return Ok(await _statisticsRepository.DateStatus());
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStatistics()
        {
            return Ok(await _statisticsRepository.Statistics());
        }

        [HttpGet("profits")]
        public async Task<IActionResult> GetTeamsProfit()
        {
            return Ok(await _statisticsRepository.TeamsProfit());
        }
    }
}