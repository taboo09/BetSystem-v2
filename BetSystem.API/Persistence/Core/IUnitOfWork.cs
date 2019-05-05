using System.Threading.Tasks;

namespace BetSystem.API.Persistence.Core
{
    public interface IUnitOfWork
    {
        Task  SaveAll();
    }
}