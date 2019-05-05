using System;

namespace BetSystem.API.DTOs
{
    public class StatisticsDto
    {
        public int WeeklyProfit { get; set; } = 0;
        public int TotalMatches { get; set; }
        public int TotalWon { get; set; }
        public double WonPercentage { get; set; }
        public double TotalBet { get; set; }
        public double TotalEarn { get; set; }
        public double Profit { get; set; }
        public double MaxStake { get; set; }
        public double MaxReturn { get; set; }
        public double MaxOdd { get; set; }
        public int DatesNr { get; set; }
        public string FirstBetDate { get; set; }
        public string LastBetDate { get; set; }
        public int ActiveDays { get; set; }
    }
}