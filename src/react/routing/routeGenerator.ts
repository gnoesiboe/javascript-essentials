import {
    PlaceholderReplacements,
    replacePlaceholdersInString,
} from '../../utilities/stringUtilities';

/**
 * Takes a route name with placeholders (ie. /blog/post/:id/:slug), and an object with
 * replacements (ie. { ':id': 1, ':slug': 'some-title' }), and generates a route path
 * from it (ie. /blog/post/1/some-title)
 */
export function createPathFromRoute(
    routeWithPlaceholders: string,
    replacements: PlaceholderReplacements
): string {
    return replacePlaceholdersInString(routeWithPlaceholders, replacements);
}
