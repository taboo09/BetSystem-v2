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
    public class SeasonController : ControllerBase
    {
        private readonly ISeasonRepository _seasonRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public SeasonController(ISeasonRepository seasonRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _seasonRepository = seasonRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetSeasons()
        {
            return Ok(await _seasonRepository.GetSeasons());
        }

        [HttpPost]
        public async Task<IActionResult> Add(SeasonDto seasonDto)
        {
            var season = _mapper.Map<Season>(seasonDto);

            if (await _seasonRepository.AddSeason(season))
            {
                await _unitOfWork.SaveAll();

                // return CreatedAtRoute("GetSeasons", _mapper.Map<SeasonDto>(season));
                return Ok(season);
            }

            else
                return BadRequest($"Season {season.Name} already exists in database.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> CloseSeason(int id)
        {
            if (await _seasonRepository.CloseSeason(id))
            {
                await _unitOfWork.SaveAll();

                return NoContent();
            }
            else
                return BadRequest($"Season id: {id} already closed.");
        }

        [HttpPut("{id}/select")]
        public async Task<IActionResult> SelectSeason(int id)
        {
            if (await _seasonRepository.SelectSeason(id))
            {
                await _unitOfWork.SaveAll();

                return NoContent();
            }
            else
                return BadRequest($"Season already selected");
        }

        [HttpGet("selected")]
        public async Task<IActionResult> GetSelectedSeason()
        {
            var season = await _seasonRepository.IsSelected();

            return Ok(season);
        }
    }
}