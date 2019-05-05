using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BetSystem.API.Models
{
    [Table("Currency")]
    public class Currency
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(10)]
        public string Symbol { get; set; }
        public bool IsSelected { get; set; }
    }
}