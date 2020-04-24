import { replacePlaceholdersInString } from '../stringUtilities';

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
});
