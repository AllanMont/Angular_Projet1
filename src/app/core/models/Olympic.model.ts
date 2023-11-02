import { IParticipation } from "./Participation.model";

export interface IOlympicCountry { 
  id: number, 
  country: string,
  participations: IParticipation[]
}
