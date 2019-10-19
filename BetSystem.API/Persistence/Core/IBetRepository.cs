using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BetSystem.API.Models;

namespace BetSystem.API.Persistence.Core
{
    public interface IBetRepository
    {
        Task<bool> AddBet(Bet bet);
        Task<bool> DeleteBet(int id);
        Task<Bet> FindBet(int id);
        Task<object> GetBetsCount();
        Task<IEnumerable<object>> GetBetsAsync(int start, int size);
        Task<IEnumerable<object>> UnsettledBets();
        Task<IEnumerable<object>> AllBetsByTeamId(int teamId);
        Task<IEnumerable<object>> AllBetsByCountry(string country);
    }
}