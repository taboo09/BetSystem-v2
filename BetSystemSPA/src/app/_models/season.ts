export interface Season{
    id: number;
    name: string;
    dateStart: Date;
    dateEnd: Date;
    active: boolean;
    selected: boolean;
    teams: number;
    bets: number;
    profit: number;
}