const emojis = [
  "🍕",
  "🍔",
  "🍟",
  "🌭",
  "🍿",
  "🧈",
  "🥞",
  "🧇",
  "🍳",
  "🥨",
  "🍥",
  "🍙",
  "🍘",
  "🥗",
  "🥠",
];

export function randomEmoji() {
  const arrayLength = emojis.length + 1;
  const randomNumber = Math.floor(Math.random() * (arrayLength - 1));
  console.log(randomNumber);
  return emojis[randomNumber]!;
}

export const fibbonacci = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "34",
  "55",
  "89",
  "?",
  randomEmoji(),
];

export const OnlyFibboNumbers = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "34",
  "55",
  "89",
];
