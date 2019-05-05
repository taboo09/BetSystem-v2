using System.Collections.Generic;
using System.Threading.Tasks;
using BetSystem.API.Models;

namespace BetSystem.API.Persistence.Core
{
    public interface ITeamRepository
    {
        Task<IEnumerable<Team>> GetTeams();
        Task<bool> AddTeam(Team team);
        Task<Team> FindTeam(int id);
    }
}