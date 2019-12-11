using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Persistence
{
    public class AppRepository : IAppRepository
    {
        private readonly BetDbContext _context;
        public AppRepository(BetDbContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void AddRange<T>(List<T> entities) where T : class
        {
            _context.AddRange(entities);
        }

        public async Task<T> FindLast<T>() where T : class
        {
            return await _context.Set<T>().AsNoTracking().LastOrDefaultAsync();
        }

        public async Task<IEnumerable<T>> GetAll<T>() where T : class
        {
            return await _context.Set<T>().ToListAsync();
        }

        public void Remove<T>(T entity) where T : class
        {
            throw new System.NotImplementedException();
        }
    }
}