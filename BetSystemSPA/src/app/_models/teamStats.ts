export interface teamStats {
    id: number;
    name: string;
    country: string;
    stars: number;
    comment: string;
    enabled: boolean;
    matchesPlayed: number;
    matchesWon: number;
    percentage: number;
    moneyBet: number;
    moneyEarn: number;
    nextStake: number;
    profit: number;
}