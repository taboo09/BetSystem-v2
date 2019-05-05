using System.Threading.Tasks;
using BetSystem.API.Persistence.Core;

namespace BetSystem.API.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BetDbContext _context;
        public UnitOfWork(BetDbContext context)
        {
            _context = context;
        }

        public async Task SaveAll()
        {
            await _context.SaveChangesAsync();
        }
    }
}