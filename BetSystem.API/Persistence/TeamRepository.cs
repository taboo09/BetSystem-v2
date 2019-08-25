using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Persistence
{
    public class TeamRepository : ITeamRepository
    {
        private readonly BetDbContext _context;
        public TeamRepository(BetDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Team>> GetTeams()
        {
            return await _context.Teams.Where(x => x.Season.Selected).OrderBy(x => x.Name).ToListAsync();
        }

        public async Task<bool> AddTeam(Team team)
        {
            var teams = await _context.Teams.Include(s => s.Season).Where(s => s.Season.Selected).ToListAsync();

            if (teams.Any(s => s.Season.Active == false) || teams.Any(x => x.Name.ToLower() == team.Name.ToLower()))
                return false;

            team.SeasonId = _context.Seasons.SingleOrDefault(x => x.Selected == true).Id;
            team.Enabled = true;
            team.Comment = team.Comment == "" ? null : team.Comment;

            _context.Add(team);

            return true;
        }

        public async Task<Team> FindTeam(int id)
        {
            return await _context.Teams.SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}