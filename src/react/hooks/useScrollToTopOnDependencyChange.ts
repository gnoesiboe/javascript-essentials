import { useEffect } from 'react';

export default function useScrollToTopOnDependencyChange(
    ...dependencies: any[]
): void {
    useEffect(
        () =>
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            }),
        dependencies
    );
}
