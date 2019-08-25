using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BetSystem.API.DTOs;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.AspNetCore.Mvc;

namespace BetSystem.API.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ITeamRepository _teamRepository;
        private readonly IUnitOfWork _unitOfWork;
        public TeamController(ITeamRepository teamRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _teamRepository = teamRepository;
        }


        [HttpGet(Name = "GetTeams")]
        public async Task<IActionResult> Teams()
        {
            var teams = await _teamRepository.GetTeams();

            var teamsDto = _mapper.Map<List<TeamDto>>(teams);

            return Ok(teamsDto);
        }

        [HttpPost]
        public async Task<IActionResult> Add(TeamDto teamDto)
        {
            var team = _mapper.Map<Team>(teamDto);

            if (await _teamRepository.AddTeam(team))
            {
                await _unitOfWork.SaveAll();
                
                return CreatedAtRoute("GetTeams", teamDto);
            }
            else
                return BadRequest($"Team {team.Name} already exists in the current season.");
        }

        [HttpPut]
        public async Task<IActionResult> Update(TeamDto teamDto)
        {
            var team = await _teamRepository.FindTeam(teamDto.Id);

            team.Comment = teamDto.Comment == "" ? null : teamDto.Comment;
            team.Enabled = teamDto.Enabled;

            await _unitOfWork.SaveAll();

            return Accepted();
        }
    }
}