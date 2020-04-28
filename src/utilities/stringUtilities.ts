type ReplacementGenerator = () => string | number;

export type PlaceholderReplacements = {
    [placeholder: string]: string | number | ReplacementGenerator;
};

/**
 * Takes a string with placeholders (ie. `Hello {name}, how are you?`), and an object with
 * replacements (ie. { '{name}': 'Klaas' }), and returns the string with the placeholders
 * replaced (ie. `Hello Klaas, how are you?`)
 */
export function replacePlaceholdersInString(
    stringWithPlaceholders: string,
    placeholderReplacements: PlaceholderReplacements
): string {
    let output = stringWithPlaceholders;

    Object.keys(placeholderReplacements).forEach((placeholder) => {
        let replacement = placeholderReplacements[placeholder];

        if (typeof replacement === 'function') {
            replacement = replacement();
        }

        output = output.replace(placeholder, replacement.toString());
    });

    return output;
}

export function truncatePreservingWords(
    value: string,
    maxLength: number,
    suffix: string = '…'
) {
    if (value.length < maxLength) {
        return value;
    }

    const maxContentLength = maxLength - suffix.length;
    const individualWords = value.split(/[\s]+/);

    let truncatedValue: string = '';

    for (let i = 0, l = individualWords.length; i < l; i++) {
        const truncatedValueWithNextWord = `${truncatedValue} ${individualWords[i]}`;

        if (truncatedValueWithNextWord.length <= maxContentLength) {
            truncatedValue = truncatedValueWithNextWord;
        } else {
            break;
        }
    }

    return truncatedValue.trim() + suffix;
}

export function createFullNameFromParts(
    firstName: string,
    preposition: string | null,
    lastName: string
): string {
    return [firstName, preposition, lastName]
        .filter((part) => !!part)
        .join(' ');
}

export function removeLineBreaks(
    value: string,
    replaceWith: string = ' '
): string {
    return value.replace(/\r?\n|\r/g, replaceWith);
}
