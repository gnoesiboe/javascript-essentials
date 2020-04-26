import {
    replacePlaceholdersInString,
    truncatePreservingWords,
    createFullNameFromParts,
} from '../stringUtilities';

describe('stringUtilities', () => {
    describe('replacePlaceholdersInString', () => {
        describe('with no replacements supplied', () => {
            it('should return the input', () => {
                const input = 'test';
                const output = replacePlaceholdersInString(input, {});

                expect(output).toBe(input);
            });
        });

        describe('with string replacements supplied', () => {
            it('should return the expected output', () => {
                const output = replacePlaceholdersInString(
                    'Hi {name}, how is your {relative} doing?',
                    {
                        '{name}': 'Klaas',
                        '{relative}': 'sister',
                    }
                );

                expect(output).toBe('Hi Klaas, how is your sister doing?');
            });
        });

        describe('with number replacements supplied', () => {
            it('should return the expected output', () => {
                const output = replacePlaceholdersInString(
                    '{first} + {second} = {outcome}',
                    {
                        '{first}': 1,
                        '{second}': 2,
                        '{outcome}': 3,
                    }
                );

                expect(output).toBe('1 + 2 = 3');
            });
        });

        describe('with functional replacements supplied', () => {
            it('should return the expected output', () => {
                const first = 1;
                const second = '3';

                const output = replacePlaceholdersInString(
                    '{first} + {second} = {outcome}',
                    {
                        '{first}': first,
                        '{second}': second,
                        '{outcome}': () => first + parseInt(second),
                    }
                );

                expect(output).toBe('1 + 3 = 4');
            });
        });
    });

    describe('truncatePreservingWords', () => {
        describe('When providing a string that is shorter than the max length', () => {
            it('should return the string as it is passed in', () => {
                const input = 'some short string';

                const output = truncatePreservingWords(input, 100);

                expect(output).toBe(input);
            });
        });

        describe('When providing a string that is longer than the max length', () => {
            it('should truncate the string preserving words', () => {
                const maxLength = 14;
                const output = truncatePreservingWords(
                    'some short string',
                    maxLength
                );

                expect(output).toBe('some short…');
                expect(output.length).toBeLessThan(maxLength);
            });
        });

        describe('When requiring another suffix than the default', () => {
            it('should apply it', () => {
                const output = truncatePreservingWords(
                    'some short string',
                    14,
                    '&'
                );

                expect(output).toBe('some short&');
            });
        });
    });

    describe('createFullNameFromParts', () => {
        describe('with all parts supplied', () => {
            it('should return the expected output', () => {
                const fullName = createFullNameFromParts(
                    'Peter',
                    'van der',
                    'Sanden'
                );

                expect(fullName).toBe('Peter van der Sanden');
            });
        });

        describe('with only first and last name supplied', () => {
            it('should return the expected output', () => {
                const fullName = createFullNameFromParts(
                    'Peter',
                    null,
                    'Jansen'
                );

                expect(fullName).toBe('Peter Jansen');
            });
        });
    });
});
