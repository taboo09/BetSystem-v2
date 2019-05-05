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
    public class CurrencyController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICurrencyRepository _currencyRepository;
        private readonly IUnitOfWork _unitOfWork;
        public CurrencyController(IMapper mapper, ICurrencyRepository currencyRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _currencyRepository = currencyRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Add(CurrencyDto currencyDto)
        {
            var currency = _mapper.Map<Currency>(currencyDto);

            if (! await _currencyRepository.Add(currency))                
                return BadRequest("Currency already exist in database.");
        
            await _unitOfWork.SaveAll();

            return CreatedAtRoute("SelectCurrency", new { id = currency.Id }, currencyDto);
        }

        [HttpPut("{id}", Name = "SelectCurrency")]
        public async Task<IActionResult> SelectCurrency(int id)
        {
            if (await _currencyRepository.SelectCurrency(id)) 
            {
                await _unitOfWork.SaveAll();

                return NoContent();
            }

            return NotFound("Currency not found.");
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrencies()
        {
            return Ok(await _currencyRepository.GetCurrencies());
        }

        [HttpGet("selected")]
        public async Task<IActionResult> GetCurrency()
        {
            return Ok(await _currencyRepository.GetCurrency());
        }
    }
}