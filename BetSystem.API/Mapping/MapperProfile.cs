using AutoMapper;
using BetSystem.API.DTOs;
using BetSystem.API.Models;

namespace BetSystem.API.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            // Domain to API Resources
            CreateMap<Bet, BetDto>();

            // API Resouces to Domain
            CreateMap<CurrencyDto, Currency>();
            CreateMap<SeasonDto, Season>();
            CreateMap<TeamDto, Team>();
            CreateMap<BetDto, Bet>();
        }
    }
}