using System.Collections.Generic;
using System.Threading.Tasks;
using BetSystem.API.Models;
using BetSystem.API.Persistence.Core;
using Microsoft.EntityFrameworkCore;

namespace BetSystem.API.Persistence
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly BetDbContext _context;
        public CurrencyRepository(BetDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Currency currency)
        {
            var result = ! await _context.Currencies.AnyAsync(c => c.Name == currency.Name);

            if (result) _context.Add(currency);

            return result;
        }

        public async Task<bool> SelectCurrency(int id)
        {
            var currencyNew = await _context.Currencies.FirstOrDefaultAsync(c => c.Id == id);

            if (currencyNew == null) return false;

            var currencyOld = await _context.Currencies.FirstOrDefaultAsync(c => c.IsSelected);

            currencyOld.IsSelected = false;
            currencyNew.IsSelected = true;

            return true;
        }

        public async Task<IEnumerable<Currency>> GetCurrencies()
        {
            return await _context.Currencies.ToListAsync();
        }

        public async Task<Currency> GetCurrency()
        {
            return await _context.Currencies.FirstOrDefaultAsync(x => x.IsSelected);
        }
    }
}