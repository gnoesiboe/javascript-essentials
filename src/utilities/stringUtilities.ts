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
