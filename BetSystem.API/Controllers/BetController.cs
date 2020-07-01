using System;
using System.Collections.Generic;
using System.Linq;
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
    public class BetController : ControllerBase
    {
        const int BETSIZE = 50;
        private readonly IBetRepository _betRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public BetController(IBetRepository betRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _betRepository = betRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Add(BetDto betDto)
        {
            var bet = _mapper.Map<Bet>(betDto);

            // getting date from string to avoid GMT parsing
            bet.Date = DateTime.Parse(betDto.Date_Text);

            bet.CashReturn = Math.Round(bet.Odd * bet.Stake, 2);

            if (await _betRepository.AddBet(bet))
            {
                await _unitOfWork.SaveAll();
                return Ok(new { message = "New bet has been created." });
            }

            return BadRequest($"Team belongs to a non-active or unselected season!");
        }

        [HttpGet]
        public async Task<IActionResult> GetBets([FromQuery] int start)
        {
            var bets = await _betRepository.GetBetsAsync(start, BETSIZE);

            return Ok(bets);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetBetsCount()
        {
            return Ok(await _betRepository.GetBetsCount());
        }

        [HttpGet("unsettled")]
        public async Task<IActionResult> GetUnsettledBets()
        {
            return Ok(await _betRepository.UnsettledBets());
        }

        [HttpGet("last15")]
        public async Task<IActionResult> GetLast15Bets()
        {
            return Ok(await _betRepository.GetBetsAsync(0, 15));
        }

        [HttpGet("lastdate")]
        public async Task<IActionResult> GetLastDateBets()
        {
            return Ok(await _betRepository.GetBetsAsync(0, 0));
        }

        [HttpGet("country/{country}")]
        public async Task<IActionResult> GetBetsByCountry(string country)
        {
            if (country == null) return BadRequest("Country name cannot be empty");

            return Ok(await _betRepository.AllBetsByCountry(country));
        }


        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetAllBetsByTeamId(int teamId)
        {
            var bets = await _betRepository.AllBetsByTeamId(teamId);

            if (bets.ToList().Count == 0) return BadRequest("No bets for this Team or Team does not exist.");

            return Ok(bets);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (await _betRepository.DeleteBet(id)) 
            {
                await _unitOfWork.SaveAll();
                return Accepted(new { message = "Bet has been deleted." });
            }

            return BadRequest("Cannot delete a bet from a non-active or unselected season!");
        }

        [HttpPut]
        public async Task<IActionResult> Update(BetUpdateDto betDto)
        {
            if (betDto.Won != null)
            {
               var betFromRepo = await _betRepository.FindBet(betDto.Id);

                betFromRepo.Won = betDto.Won;

                betFromRepo.Withdrawal = betDto.Withdrawal <= betFromRepo.CashReturn ? betDto.Withdrawal : betFromRepo.CashReturn;
            
                betFromRepo.Profit = betDto.Won == true ? betDto.Withdrawal > 0 ? betFromRepo.Withdrawal : betFromRepo.CashReturn : 0;
            
                betFromRepo.Withdrawal = betDto.Won == false ? 0 : betFromRepo.Withdrawal;                


                await _unitOfWork.SaveAll();

                return Accepted(new { message = "Bet has been updated." });
            }

            return BadRequest("Error occurred saving the bet.");
        }
    }
}