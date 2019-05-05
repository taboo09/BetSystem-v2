using System.ComponentModel.DataAnnotations;

namespace BetSystem.API.DTOs
{
    public class CurrencyDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Symbol { get; set; }
    }
}