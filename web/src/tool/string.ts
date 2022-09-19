const firstNonCapitalLetterRegex = /(?<![\p{L}\d_-])[\p{Ll}]/u;
const nonCapitalWordRegex = /(?<![\p{L}\d_-])[\p{Ll}]+/ug

const PRESERVED_LOWERCASE_WORDS = [
    // Articles
    'a', 'an', 'the',
    // Coordinating Conjunctions (FANBOYS)
    'for', 'and', 'nor', 'but', 'or', 'yet', 'so',
];

/**
 * <p>Capitalize the first letter in any word.</p>
 * <p><b>Notes:</b><ul>
 *     <li>All prefixed spaces are preserved</li>
 *     <li>Multilingual support</li>
 * </ul></p>
 */
export const wordCapitalize = (word: string) =>
    word && word.replace(firstNonCapitalLetterRegex, firstLetter => firstLetter.toUpperCase());

/**
 * <p>Capitalize each word in a sentence.</p>
 * <p><b>Notes:</b><ul>
 *     <li>Articles and coordinating conjunction words are not included</li>
 * </ul></p>
 * @param sentence
 */
export const sentenceCapitalize = (sentence: string) =>
    sentence && wordCapitalize(sentence.toLowerCase())
        .replace(nonCapitalWordRegex, word =>
            PRESERVED_LOWERCASE_WORDS.includes(word.toLowerCase())
                ? word
                : wordCapitalize(word));
