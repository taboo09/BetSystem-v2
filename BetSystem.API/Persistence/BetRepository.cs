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

        public async Task<object> GetBetsCount()
        {
            var count = await _context.Bets.CountAsync(x => x.Team.Season.Selected);
            var unsettled = await _context.Bets.CountAsync(x => x.Team.Season.Selected && x.Won == null);
             
             return new { Count = count, Unsettled = unsettled };
        }

        public async Task<IEnumerable<object>> GetBetsAsync(int start, int size)
        {
            switch (size)
            {
                case 15:
                    var count = await _context.Bets.Where(x => x.Team.Season.Selected).CountAsync();
                    start = count > 15 ? count - 15 : 0;
                    break;
                case 0:
                    var countBets = await _context.Bets.Where(x => x.Team.Season.Selected).CountAsync();
                    if (countBets > 0) {
                        var lastDate = (await _context.Bets.Where(x => x.Team.Season.Selected).OrderBy(x => x.Date).LastAsync()).Date;
                        size = await _context.Bets.Where(x => x.Date == lastDate).CountAsync();
                        start = countBets - size;
                    } 
                    break;
                default:
                    break;
            }

            return await _context.Bets.Where(x => x.Team.Season.Selected).Select(x => new {
                Id = x.Id,
                TeamId = x.TeamId,
                Team = x.Team.Name,
                Country = x.Team.Country,
                Home = x.Home,
                Away = x.Away,
                Date = x.Date,
                Stake = x.Stake,
                Odd = x.Odd,
                Won = x.Won,
                Withdrawal = x.Withdrawal,
                CashReturn = x.CashReturn,
                Profit = x.Profit
            }).OrderBy(x => x.Date).ThenBy(x => x.Id).Skip(start).Take(size).ToListAsync();
        }

        public async Task<IEnumerable<object>> UnsettledBets()
        {
            return await _context.Bets.Where(x => x.Team.Season.Selected && x.Won == null).Select(x => new {
                Id = x.Id,
                TeamId = x.TeamId,
                Team = x.Team.Name,
                Country = x.Team.Country,
                Home = x.Home,
                Away = x.Away,
                Date = x.Date,
                Stake = x.Stake,
                Odd = x.Odd,
                Won = x.Won,
                Withdrawal = x.Withdrawal,
                CashReturn = x.CashReturn,
                Profit = x.Profit
            }).OrderBy(x => x.Date).ThenBy(x => x.Id).ToListAsync();
        }

        public async Task<IEnumerable<object>> AllBetsByTeamId(int teamId)
        {
            return await _context.Bets.Where(x => x.Team.Season.Selected && x.TeamId == teamId).Select(x => new {
                Id = x.Id,
                TeamId = x.TeamId,
                Team = x.Team.Name,
                Country = x.Team.Country,
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

        public async Task<IEnumerable<object>> AllBetsByCountry(string country)
        {
            return await _context.Bets.Where(x => x.Team.Season.Selected && x.Team.Country == country).Select(x => new {
                Id = x.Id,
                TeamId = x.TeamId,
                Team = x.Team.Name,
                Country = x.Team.Country,
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
            var team = await _context.Teams.SingleOrDefaultAsync(t => t.Id == teamId);

            return team.Season.Active == false ? false : team.Season.Selected;
        }
    }
}