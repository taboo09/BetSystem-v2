using System;
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
    [Route("/api/[controller]")]
    [ApiController]
    public class BetController : ControllerBase
    {
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
           // Ignore UTC format for diffent time zones
            betDto.Date = DateTime.Parse(betDto.Date_Text);

            var bet = _mapper.Map<Bet>(betDto);

            bet.CashReturn = Math.Round(bet.Odd * bet.Stake, 2);
            bet.Date = bet.Date.Date;

            if (await _betRepository.AddBet(bet))
            {
                await _unitOfWork.SaveAll();
                return Ok();
            }

            return BadRequest($"Team belongs to a non-active or unselected season!");
        }

        [HttpGet]
        public IActionResult GetBets()
        {
            var bets = _betRepository.GetBets();

            return Ok(bets);
        }

        [HttpGet("betasync")]
        public async Task<IActionResult> GetBetsAsync()
        {
            var bets = await _betRepository.GetBetsAsync();

            return Ok(bets);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (await _betRepository.DeleteBet(id)) 
            {
                await _unitOfWork.SaveAll();
                return Accepted();
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

                return Accepted();
            }

            return BadRequest();
        }
    }
}