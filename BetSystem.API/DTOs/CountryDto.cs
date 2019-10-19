using System;

namespace BetSystem.API.DTOs
{
    public class CountryDto
    {
        private string _countryName;
        public string CountryName
        {
            get { return _countryName; }
            set { _countryName = value.ToUpper(); }
        }

        public double MoneyBet { get; set; }
        public double MoneyEarn { get; set; }
        public int NrTeams { get; set; }
        public double Profit
        {
            get { return Math.Round(MoneyEarn - MoneyBet, 2); }
            private set { }
        }
    }
}