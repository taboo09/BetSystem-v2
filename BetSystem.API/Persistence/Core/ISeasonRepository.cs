using System.Collections.Generic;
using System.Threading.Tasks;
using BetSystem.API.Models;

namespace BetSystem.API.Persistence.Core
{
    public interface ISeasonRepository
    {
        Task<IEnumerable<Season>> GetSeasons();
        Task<bool> AddSeason(Season season);
        Task<bool> CloseSeason(int id);
        Task<bool> SelectSeason(int id);
        Task<Season> IsSelected();
    }
}