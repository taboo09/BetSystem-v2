using System.Collections.Generic;
using System.Linq;
using BetSystem.API.Models;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Newtonsoft.Json;

namespace BetSystem.API.Persistence.Helper
{
    public class SeedData
    {
        private readonly BetDbContext _context; 
        public SeedData(BetDbContext context)
        {
            _context = context;
        }

        public async void Seed() 
        {
            // Check if there is a database
            var exists = (_context.Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator).Exists(); 
    
            if (exists) 
            {
                if (!_context.Currencies.Any()) 
                {
                    var currencyData = System.IO.File.ReadAllText("Persistence/Helper/Currencies.json");
                    var currencies = JsonConvert.DeserializeObject<List<Currency>>(currencyData); 
            
                    foreach (var currency in currencies) 
                    {
                        _context.Add(currency); 
                    }
                }
                if (!_context.AppVersion.Any())
                {
                    var appVersionInitial = System.IO.File.ReadAllText("Persistence/Helper/AppVersion.json");
                    var appVersion = JsonConvert.DeserializeObject<AppVersion>(appVersionInitial);

                    _context.Add(appVersion);
                }

                await _context.SaveChangesAsync();
            }
        }     
    }
}