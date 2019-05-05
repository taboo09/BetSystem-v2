using System;
using System.ComponentModel.DataAnnotations;

namespace BetSystem.API.Models
{
    public class AppVersion
    {
        public int Id { get; set; }
        [StringLength(25)]
        public string Value { get; set; }
        public DateTime Date { get; set; }
    }
}