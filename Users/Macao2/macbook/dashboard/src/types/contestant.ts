export interface Contestant {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  measurements: string;
  hometown: string;
  occupation: string;
  bio: string;
  imageUrl: string;
  contestId: string;
  votes: number;
  createdAt?: string;
  updatedAt?: string;
}