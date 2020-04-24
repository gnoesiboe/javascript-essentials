import { createRangeArray } from '../arrayUtilities';

describe('arrayUtilities', () => {
    describe('createRangeArray', () => {
        describe('when from lies before until', () => {
            it('should throw an error', () => {
                expect(() => {
                    createRangeArray(2, 1);
                }).toThrow();
            });
        });

        describe('when from is the same as until', () => {
            it('should return one single array', () => {
                expect(createRangeArray(2, 2)).toEqual([2]);
            });
        });

        describe('with an until that lies higher than the from', () => {
            it('should return the expected output with a default step of 1', () => {
                expect(createRangeArray(2, 5)).toEqual([2, 3, 4, 5]);
            });

            it('should return the expected output with a custom step', () => {
                expect(createRangeArray(2, 6, 2)).toEqual([2, 4, 6]);
                expect(createRangeArray(2, 7, 2)).toEqual([2, 4, 6]);
            });
        });
    });
});
