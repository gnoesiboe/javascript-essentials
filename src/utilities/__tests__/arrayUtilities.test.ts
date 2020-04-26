import {
    createRangeArray,
    groupResultsByCallback,
    groupObjectArrayByObjectKey,
} from '../arrayUtilities';

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

    describe('groupResultsByCallback', () => {
        it('should return the grouped results', () => {
            type ItemType = { title: string; type: string };

            const items: Array<ItemType> = [
                {
                    title: 'Some title',
                    type: 'blogpost',
                },
                {
                    title: 'Other title',
                    type: 'blogpost',
                },
                {
                    title: 'Another value',
                    type: 'newsArticle',
                },
            ];

            const result = groupResultsByCallback<ItemType>(
                items,
                (item) => item.type
            );

            expect(Object.keys(result)).toHaveLength(2);
            expect(Object.keys(result)).toEqual(['blogpost', 'newsArticle']);

            const blogposts = result.blogpost;
            expect(blogposts).toHaveLength(2);

            const newsArticles = result.newsArticle;
            expect(newsArticles).toHaveLength(1);
        });
    });

    describe('groupObjectArrayByObjectKey', () => {
        it('should return the grouped results as expected', () => {
            type ItemType = { title: string; type?: string };

            const items: Array<ItemType> = [
                {
                    title: 'Some title',
                    type: 'blogpost',
                },
                {
                    title: 'Other title',
                    type: 'blogpost',
                },
                {
                    title: 'Another value',
                },
            ];

            const result = groupObjectArrayByObjectKey<ItemType>(items, 'type');

            expect(Object.keys(result)).toHaveLength(2);
            expect(Object.keys(result)).toEqual(['blogpost', 'other']);

            const blogposts = result.blogpost;
            expect(blogposts).toHaveLength(2);

            const newsArticles = result.other;
            expect(newsArticles).toHaveLength(1);
        });
    });
});
