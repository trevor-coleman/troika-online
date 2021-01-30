import random from '../../utils/SeededRandom';
import stringHash from './stringHash';

export function rollKey(key: string, dice: number[]): number[] {
  const seed = stringHash(key);
  const roll: number[] = [];
  for (let i = 0; i < dice.length; i++) {
    const dieSeed = random(seed * (
        i + 1) * 21345) * 12345566

    roll.push(Math.floor(random(dieSeed) * (
        dice[i])))
  }

  return roll;
}
