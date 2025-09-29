export default function randomThreeDigit(): number {
  return Math.floor(Math.random() * 900) + 100;
}
