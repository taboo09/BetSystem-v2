using System;

namespace BetSystem.API.DTOs
{
    public class DateStatusDto
    {
        public DateTime Date { get; set; }
        public int MatchesPlayed { get; set; }
        public int MatchesWon { get; set; }
        public double Percentage { get; set; }
        public double MoneyBet { get; set; }
        public double MoneyEarn { get; set; }
        public double Profit { get; set; }
    }
}