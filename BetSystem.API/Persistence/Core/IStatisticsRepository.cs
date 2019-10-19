using System.Collections.Generic;
using System.Threading.Tasks;
using BetSystem.API.DTOs;

namespace BetSystem.API.Persistence.Core
{
    public interface IStatisticsRepository
    {
        Task<IEnumerable<TeamStatusDto>> TeamStatus(int? id);
        Task<IEnumerable<DateStatusDto>> DateStatus();
        Task<StatisticsDto> Statistics();
        Task<IEnumerable<TeamProfitDto>> TeamsProfit();
        Task<IEnumerable<CountryDto>> CountriesStas();
    }
}