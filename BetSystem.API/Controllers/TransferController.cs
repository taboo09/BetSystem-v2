using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BetSystem.API.DTOs;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransferController : ControllerBase
    {
        private readonly IAppRepository _appRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public TransferController(IAppRepository appRepository, 
            IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _appRepository = appRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string type)
        {
            var error = new
            {
                info = "Download API should contain a TYPE param",
                cases = "type can be appversions/seasons/teams/bets",
                example = "...api/download?type=bets"
            };

            if (type == null) return BadRequest(error);

            var objectList = new List<object>();

            switch (type)
            {
                case "appversions":
                    objectList = _mapper.Map<List<AppVersionDto>>(await _appRepository.GetAll<AppVersion>())
                        .Cast<object>().ToList();
                    break;
                case "seasons":
                    // ID is necessary
                    objectList = (await _appRepository.GetAll<Season>())
                        .Cast<object>().ToList();
                    break;
                case "teams":
                    // ID is necessary
                    objectList = _mapper.Map<List<TeamDownloadDto>>(await _appRepository.GetAll<Team>())
                        .Cast<object>().ToList();
                    break;
                case "bets":
                    // ID is not necessary
                    // Need to split data to each season
                    objectList = _mapper.Map<List<BetDownloadDto>>(await _appRepository.GetAll<Bet>())
                        .Cast<object>().ToList();
                    break;
                default:
                    return BadRequest(error);
            }

            return Ok(objectList);
        }

        [HttpGet("season/{id}")]
        public async Task<IActionResult> GetDataBySeasonId(int id)
        {
            if (id == 0) return BadRequest("Id cannot be null or 0");

            var data = (await _appRepository.GetAll<Bet>()).Where(x => x.Team.SeasonId == id).ToList();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> SaveData(List<Bet> bets)
        {
            // create a new season record
            Season season = bets[0].Team.Season;

            _appRepository.Add<Season>(season);

            await _unitOfWork.SaveAll();

            var season_id = season.Id;

            var teams = bets.Select(x => x.Team).GroupBy(x => x.Id).Select(x => x.First()).ToList();

            var newListOfBets = new List<Bet>();

            foreach (var team in teams)
            {
                int old_teamId = team.Id;

                team.Id = 0;

                _appRepository.Add<Team>(team);

                await _unitOfWork.SaveAll();

                int new_teamId = team.Id;

                var listOfBets = bets.Where(x => x.TeamId == old_teamId).ToList();

                for (int i = 0; i < listOfBets.Count; i++)
                {
                    listOfBets[i].TeamId = new_teamId;
                    listOfBets[i].Id = 0;
                    newListOfBets.Add(listOfBets[i]);
                }
            }

            newListOfBets = newListOfBets.OrderBy(x => x.Date).ToList();

            _appRepository.AddRange<Bet>(newListOfBets);

            await _unitOfWork.SaveAll();

            return Ok();
        }
    }
}