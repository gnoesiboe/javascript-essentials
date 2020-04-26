import { useCallback, useRef, useState } from 'react';

type StateCreator = <S>(oldState: S) => S;

/**
 * To be used when you need to use a `useRef` to be able to access the latest state of
 * a value, but also require a `useState` to ensure that the component is re-rendered
 * when the value changes. This hook ensures that always the latest value is returned,
 * and always a new value is set both to the ref and the state. It's purpose is to make
 * our component code more dry and less error prone.
 *
 * Only use this when required, as this may result in memory leaks if the ref is not
 * cleared correctly
 */
export default function useStateWithRef<S>(
    initialState: S
): [
    () => S,
    (newState: S | StateCreator) => void,
    S,
    React.MutableRefObject<S>
] {
    const [state, _setState] = useState<S>(initialState);

    const ref = useRef<S>(state);

    const setState = useCallback((newState) => {
        if (typeof newState === 'function') {
            _setState((prevState) => {
                const generatedState = newState(prevState);

                ref.current = generatedState;

                return generatedState;
            });
        } else {
            ref.current = newState;

            _setState(newState);
        }
    }, []);

    const getState = (): S => {
        return ref.current;
    };

    return [getState, setState, state, ref];
}
