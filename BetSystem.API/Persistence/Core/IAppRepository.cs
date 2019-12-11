using System.Collections.Generic;
using System.Threading.Tasks;

namespace BetSystem.API.Persistence.Core
{
    public interface IAppRepository
    {
        void Add<T>(T entity) where T: class;
        void AddRange<T>(List<T> entitie) where T: class;
        void Remove<T>(T entity) where T: class;
        Task<IEnumerable<T>> GetAll<T>() where T: class;
        Task<T> FindLast<T>() where T: class;
    }
}