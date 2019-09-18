using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BetSystem.API.Models
{
    [Table("Bets")]
    public class Bet
    {
        public int Id { get; set; }
        public virtual Team Team { get; set; }
        public int TeamId { get; set; }

        [StringLength(50)]
        public string Home { get; set; }

        [StringLength(50)]
        public string Away { get; set; }
        public DateTime Date { get; set; }
        public double Odd { get; set ; }
        public double Stake { get; set; }
        public double CashReturn { get; set; }
        public bool? Won { get; set; }
        public double Withdrawal { get; set; }
        public double Profit { get; set; }
    }
}