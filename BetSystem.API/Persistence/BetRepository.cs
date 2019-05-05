using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Persistence
{
    public class BetRepository : IBetRepository
    {
        private readonly BetDbContext _context;
        public BetRepository(BetDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddBet(Bet bet)
        {
            if (!await CheckSeason(bet.TeamId)) 
                return false;

            _context.Add(bet); 

            return true;
        }

        public async Task<bool> DeleteBet(int id)
        {
            var bet = await _context.Bets.SingleOrDefaultAsync(x => x.Id == id);

            if (bet != null) {
                
                if (!await CheckSeason(bet.TeamId)) 
                    return false;
                
                _context.Remove(bet);

                return true;
            }
            return false;
        }

        public IEnumerable<object> GetBets()
        {
            return _context.Bets.Include(t => t.Team).Where(x => x.Team.Season.Selected).Select(x => new {
                Id = x.Id,
                TeamId = x.TeamId,
                Team = x.Team.Name,
                Home = x.Home,
                Away = x.Away,
                Date = x.Date,
                Stake = x.Stake,
                Odd = x.Odd,
                Won = x.Won,
                Withdrawal = x.Withdrawal,
                CashReturn = x.CashReturn,
                Profit = x.Profit
            }).OrderBy(x => x.Date).ToList();
        }

        public async Task<IEnumerable<object>> GetBetsAsync()
        {
            return await _context.Bets.Include(t => t.Team).Where(x => x.Team.Season.Selected).Select(x => new {
                Id = x.Id,
                TeamId = x.TeamId,
                Team = x.Team.Name,
                Home = x.Home,
                Away = x.Away,
                Date = x.Date,
                Stake = x.Stake,
                Odd = x.Odd,
                Won = x.Won,
                Withdrawal = x.Withdrawal,
                CashReturn = x.CashReturn,
                Profit = x.Profit
            }).OrderBy(x => x.Date).ToListAsync();
        }
        public async Task<Bet> FindBet(int id)
        {
            return await _context.Bets.SingleOrDefaultAsync(b => b.Id == id);
        }

        private async Task<bool> CheckSeason(int teamId)
        {
            var team = await _context.Teams.Include(s => s.Season).SingleOrDefaultAsync(t => t.Id == teamId);

            return team.Season.Active == false ? false : team.Season.Selected;
        }
    }
}