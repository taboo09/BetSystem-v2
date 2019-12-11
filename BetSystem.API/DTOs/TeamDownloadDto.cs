namespace BetSystem.API.Models
{
    public class TeamDownloadDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SeasonId { get; set; }
        public string Comment { get; set; }
        public bool Enabled { get; set; } 
        public string Country { get; set; }
    }
}