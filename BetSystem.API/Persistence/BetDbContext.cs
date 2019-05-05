using BetSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Persistence
{
    public class BetDbContext : DbContext
    {
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Bet> Bets { get; set; }
        public DbSet<AppVersion> AppVersion { get; set; }

        public BetDbContext(DbContextOptions<BetDbContext> options) : base(options)
        {
        }
    }
}