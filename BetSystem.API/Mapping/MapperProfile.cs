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
            CreateMap<Bet, BetDto>()
                .ForMember(x => x.Team, y => y.MapFrom(z => z.Team.Name))
                .ForMember(x => x.Country, y => y.MapFrom(z => z.Team.Country));
            CreateMap<Team, TeamDto>();
            CreateMap<AppVersion, AppVersionDto>();
            CreateMap<Team, TeamDownloadDto>();
            CreateMap<Bet, BetDownloadDto>();

            // API Resouces to Domain
            CreateMap<CurrencyDto, Currency>();
            CreateMap<SeasonDto, Season>();
            CreateMap<TeamDto, Team>();
            CreateMap<BetDto, Bet>();

        }
    }
}