using System;

namespace BetSystem.API.DTOs
{
    public class TeamStatusDto
    {
        public int Id { get; set; }        
        public string Name { get; set; }
        public int Stars { get; set; }
        public string Comment { get; set; }
        public string Country { get; set; }
        public bool Enabled { get; set; }
        public DateTime? LastDate { get; set; }
        public int MatchesPlayed { get; set; }
        public int MatchesWon { get; set; }
        public double Percentage { get; set; }
        public double MoneyBet { get; set; }
        public double MoneyEarn { get; set; }
        public double NextStake { get; set; }
        public double Profit { get; set; }
    }
}