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
        IEnumerable<object> GetBets();
        Task<IEnumerable<object>> GetBetsAsync();
    }
}