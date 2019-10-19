using System;

namespace BetSystem.API.DTOs
{
    public class BetDto
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string Team { get; set; } 
        public string Country { get; set; }
        public string Home { get; set; }
        public string Away { get; set; }
        public DateTime Date { get; set; }
        public string Date_Text { get; set; }
        public double Odd { get; set ; }
        public double Stake { get; set; }
        public double CashReturn { get; set; } 
        public bool? Won { get; set; }
        public double Withdrawal { get; set; }
        public double Profit { get; set; }        
    }
}