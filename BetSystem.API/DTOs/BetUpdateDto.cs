namespace BetSystem.API.DTOs
{
    public class BetUpdateDto
    {
        public int Id { get; set; }
        public bool? Won { get; set; }
        public double Withdrawal { get; set; }
    }
}