namespace BetSystem.API.DTOs
{
    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Comment { get; set; }
        public bool Enabled { get; set; }
        private string _country;
        public string Country
        {
            get { return _country; }
            set { _country = value.ToLower(); }
        }
        
    }
}