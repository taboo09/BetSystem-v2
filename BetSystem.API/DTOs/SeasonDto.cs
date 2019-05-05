using System.ComponentModel.DataAnnotations;

namespace BetSystem.API.DTOs
{
    public class SeasonDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }    
        public bool Active { get; set; }
        public bool Selected { get; set; }
    }
}