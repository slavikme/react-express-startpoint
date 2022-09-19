import {randomBytes} from "crypto";

export const randomBase62 = (size: number = 10): string => {
  const maxSize = 402653166;

  if ( size > maxSize || size < 1 )
    throw new Error(`The size provided to randomBase62 must be between 1 and ${maxSize} (inclusive). But ${size} provided.`);

  const randomBuffer = randomBytes(Math.ceil(size));
  const base62Phrase = randomBuffer.toString('base64').replace(/\W/g, '');
  const finalPhrase = base62Phrase.slice(0, size);

  if ( finalPhrase.length < size )
    return finalPhrase + randomBase62(size - finalPhrase.length + 1);

  return finalPhrase.slice(0, size);
}
