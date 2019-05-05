using System.Collections.Generic;
using System.Threading.Tasks;
using BetSystem.API.Models;

namespace BetSystem.API.Persistence.Core
{
    public interface ICurrencyRepository
    {
        Task<bool> Add(Currency currency);
        Task<bool> SelectCurrency(int id);
        Task<IEnumerable<Currency>> GetCurrencies();
        Task<Currency> GetCurrency();
    }
}