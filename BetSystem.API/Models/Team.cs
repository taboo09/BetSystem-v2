using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BetSystem.API.Models
{
    [Table("Teams")]
    public class Team
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }
        public int SeasonId { get; set; }
        public virtual Season Season { get; set; } 
        [StringLength(255)]
        public string Comment { get; set; }
        public bool Enabled { get; set; } 
    }
}