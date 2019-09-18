using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Persistence
{
    public class SeasonRepository : ISeasonRepository
    {
        private readonly BetDbContext _context;
        public SeasonRepository(BetDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Season>> GetSeasons()
        {
            await UpdateSelectedSeason();

            return await _context.Seasons.ToListAsync();
        }

        public async Task<bool> AddSeason(Season season)
        {
            if (await _context.Seasons.AnyAsync(s => s.Name == season.Name)) return false;
            
            var selectedSeason = await IsSelected();

            // or _context.Seasons.Any()
            if (selectedSeason == null) season.Selected = true;
            else if (season.Selected) selectedSeason.Selected = false;

            season.DateStart = DateTime.Now;
            season.Active = true;

            _context.Add(season);

            return true;
        }

        public async Task<bool> CloseSeason(int id)
        {
            var season = await _context.Seasons.FirstOrDefaultAsync(s => s.Id == id);

            if (season == null || !season.Active) return false;

            season.DateEnd = DateTime.Now;
            season.Active = false;

            return true;
        }

        public async Task<bool> SelectSeason(int id)
        {
            var season = await _context.Seasons.FirstOrDefaultAsync(s => s.Id == id);

            if (season == null) return false;

            var selectedSeason = await IsSelected();

            selectedSeason.Selected = false;
            season.Selected = true;

            return true;
        }

        public async Task<Season> IsSelected()
        {
            return await _context.Seasons.FirstOrDefaultAsync(s => s.Selected);
        }

        private async Task UpdateSelectedSeason()
        {
            var season = await IsSelected();

            if (season != null) 
            {
                var bets = _context.Bets.Where(x => x.Team.SeasonId == season.Id).AsQueryable();

                season.Teams = await _context.Teams.Where(t => t.SeasonId == season.Id).CountAsync();
                season.Bets = await bets.CountAsync();
                season.Profit = Math.Round(await bets.SumAsync(x => x.Profit) - await bets.SumAsync(x => x.Stake), 2);

                await _context.SaveChangesAsync();
            }
        }
    }
}