export interface bet{
    id: number;
    teamId: number;
    team: string;
    country: string;
    home: string;
    away: string;
    date: Date;
    // date_text: string;
    odd: number;
    stake: number;
    cashReturn: number;
    won: boolean;
    withdrawal: number;
    profit:number;
}