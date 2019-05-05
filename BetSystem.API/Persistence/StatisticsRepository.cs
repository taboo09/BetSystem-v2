using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BetSystem.API.DTOs;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Persistence
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly BetDbContext _context;

        public StatisticsRepository(BetDbContext context)
        {
            _context = context;
        }

        private IQueryable<Bet> GetBets() => _context.Bets.Include(t => t.Team)
                .Where(x => x.Team.Season.Selected).AsQueryable();

        // private async Task<IEnumerable<Team>> GetTeams() => await _context.Teams.Where(t => t.Season.Selected)
        //     .ToListAsync();
        private IQueryable<Team> GetTeams() => _context.Teams.Where(t => t.Season.Selected).AsQueryable();

        private async Task<TeamStatusDto> GetTeamStatus(Team team)
        {
            var listOfBets = await GetBets().Where(x => x.TeamId == team.Id).Select(x => new BetDto {
                Id = x.Id,
                Stake = x.Stake,
                Won = x.Won,
                Profit = x.Profit
            }).ToListAsync();

            var teamStatus = new TeamStatusDto();

            teamStatus.Id = team.Id;
            teamStatus.Name = team.Name;
            teamStatus.Comment = team.Comment;
            teamStatus.Enabled = team.Enabled;
            teamStatus.MatchesPlayed = listOfBets.Count();
            teamStatus.MatchesWon = listOfBets.Where(x => x.Won == true).Count();
            teamStatus.Percentage = teamStatus.MatchesWon > 0 ?
                Math.Truncate((double)teamStatus.MatchesWon / (double)teamStatus.MatchesPlayed * 100) : 0;
            teamStatus.MoneyBet = Math.Round(listOfBets.Sum(x => x.Stake), 2);
            teamStatus.MoneyEarn = Math.Round(listOfBets.Sum(x => x.Profit), 2);
            teamStatus.Stars = teamStatus.Percentage < 12 ? 0 : teamStatus.Percentage < 16 ? 1 :
                teamStatus.Percentage < 30 ? 2 : 3;

            var lastBet = listOfBets.LastOrDefault();

            teamStatus.NextStake = (lastBet == null || lastBet.Won == true) ? 1 : lastBet.Stake * 2;
            teamStatus.Profit = Math.Round(teamStatus.MoneyEarn - teamStatus.MoneyBet, 2);

            return teamStatus;
        }

        public async Task<IEnumerable<TeamStatusDto>> TeamStatus(int? id)
        {
            var listOfTeams = await GetTeams().ToListAsync();

            List<TeamStatusDto> listTeamStatus = new List<TeamStatusDto>();

            if (id != null)
            {
                var team = listOfTeams.FirstOrDefault(x => x.Id == id);

                if (team == null) return null;

                listTeamStatus.Add(await GetTeamStatus(team));
            }
            else
            {
                foreach (var team in listOfTeams)
                {
                    listTeamStatus.Add(await GetTeamStatus(team));
                }
            }

            return listTeamStatus.OrderBy(x => x.Name).ToList();
        }

        public async Task<IEnumerable<DateStatusDto>> DateStatus()
        {
            List<DateStatusDto> listOfDateStatus = new List<DateStatusDto>();

             var listOfBets = await GetBets().Select(x => new BetDto {
                Id = x.Id,
                Date = x.Date,
                Stake = x.Stake,
                Won = x.Won,
                Profit = x.Profit
            }).ToListAsync();

            foreach (var date in listOfBets.Select(x => x.Date.Date).Distinct())
            {
                var dateStatus = new DateStatusDto();

                dateStatus.Date = date;
                dateStatus.MatchesPlayed = listOfBets.Where(x => x.Date.Date == date).Count();
                dateStatus.MatchesWon = listOfBets.Where(x => x.Date.Date == date && x.Won == true).Count();
                dateStatus.Percentage = dateStatus.MatchesWon > 0 ?
                Math.Truncate((double)dateStatus.MatchesWon / (double)dateStatus.MatchesPlayed * 100) : 0;
                dateStatus.MoneyBet = Math.Round(listOfBets.Where(x => x.Date.Date == date)
                    .Sum(x => x.Stake), 2);
                dateStatus.MoneyEarn = Math.Round(listOfBets.Where(x => x.Date.Date == date)
                    .Sum(x => x.Profit), 2);
                dateStatus.Profit = Math.Round(dateStatus.MoneyEarn - dateStatus.MoneyBet,2);

                listOfDateStatus.Add(dateStatus);
            }

            return listOfDateStatus.OrderBy(x => x.Date);
        }

        public async Task<StatisticsDto> Statistics()
        {
            var listOfBets = await GetBets().Select(x => new BetDto {
                Id = x.Id,
                Date = x.Date,
                Stake = x.Stake,
                Odd = x.Odd,
                Won = x.Won,
                Profit = x.Profit
            }).OrderBy(x => x.Date).ToListAsync();

            var stats = new StatisticsDto();

            stats.TotalMatches = listOfBets.Count();
            stats.TotalWon = listOfBets.Where(x => x.Won == true).Count();
            stats.TotalEarn = Math.Round(listOfBets.Sum(x => x.Profit), 2);
            stats.WonPercentage = stats.TotalWon > 0 ?
            Math.Truncate((double)stats.TotalWon / (double)stats.TotalMatches * 100) : 0;
            stats.TotalBet = listOfBets.Sum(x => x.Stake);
            stats.Profit = Math.Round(stats.TotalEarn - stats.TotalBet, 2);

            if (!listOfBets.Any(x => x.Won == true)) 
            {
                stats.MaxStake = 0;
                stats.MaxOdd = 0;
                stats.MaxReturn = 0;
            } else 
            {
                stats.MaxStake = listOfBets.Where(x => x.Won == true).Max(x => x.Stake);
                stats.MaxOdd = listOfBets.Where(x => x.Won == true).Max(x => x.Odd);
                stats.MaxReturn = listOfBets.Where(x => x.Won == true).Max(x => x.Profit);
            }
            
            stats.FirstBetDate = listOfBets.Any() ? listOfBets.FirstOrDefault().Date.ToString("dd MMM yyyy") : "No bets";
            stats.LastBetDate = listOfBets.Any() ? listOfBets.LastOrDefault().Date.ToString("dd MMM yyyy") : "No bets";
            stats.DatesNr = listOfBets.Select(x => x.Date.Date).Distinct().Count();
            stats.ActiveDays = listOfBets.Any() ? Convert.ToInt16((listOfBets.Last().Date.Date - 
                listOfBets.First().Date.Date).TotalDays) + 1 : 0;

            int nrWeeks = listOfBets.Any() ? stats.ActiveDays / 7 : 0;

            stats.WeeklyProfit = nrWeeks > 1 ? (int)Math.Truncate(stats.Profit / nrWeeks) : 0;

            return stats;
        }

        public async Task<IEnumerable<TeamProfitDto>> TeamsProfit()
        {
            var listOfTeams = await GetTeams().ToListAsync();
            var listOfBets = await GetBets().Select(x => new BetDto {
                Id = x.Id,
                TeamId = x.TeamId,
                Stake = x.Stake,
                Profit = x.Profit
            }).ToListAsync();

            List<TeamProfitDto> teamsProfit = new List<TeamProfitDto>();

            foreach (var team in listOfTeams)
            {
                var teamProfitDto = new TeamProfitDto();

                teamProfitDto.Id = team.Id;
                teamProfitDto.Name = team.Name;
                teamProfitDto.Profit = Math.Round(listOfBets.Where(x => x.TeamId == team.Id).Sum(x => x.Profit) - 
                    listOfBets.Where(x => x.TeamId == team.Id).Sum(x => x.Stake), 2);

                teamsProfit.Add(teamProfitDto);
            }

                return teamsProfit.OrderBy(x => x.Name).ToList();
        }
    }
}