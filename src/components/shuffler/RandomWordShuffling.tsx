import { useEffect, useState } from 'react';
import shuffle from '../../utils/shuffle';

const generateRandomShuffledWord = (words: string[]) => {
  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomIndex];
  return shuffle(randomWord.split('')).join('');
};

const RandomWordShuffling = ({
  words,
  paused,
  wordsPerMs,
}: {
  words: string[];
  paused: boolean;
  wordsPerMs: number;
}) => {
  const [word, setWord] = useState(() => generateRandomShuffledWord(words));

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setWord(generateRandomShuffledWord(words));
    }, 1000 / wordsPerMs);

    return () => {
      clearInterval(interval);
    };
  }, [words, wordsPerMs, paused]);

  return <>{word}</>;
};

export default RandomWordShuffling;
