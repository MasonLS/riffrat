
export interface MouseInfo {
    mouseX: number
    mouseY: number
}

export interface Spaceship {
    type: string;
}

export type Team = "BLUE" | "GREEN" | "ORANGE" | "PURPLE"

export interface GamePlayer {
    id: string;
    cursor?: MouseInfo;
    spaceship: Spaceship;
    team: Team
}