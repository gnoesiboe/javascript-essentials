import { renderHook, act } from '@testing-library/react-hooks';
import useStateWithRef from '../useStateWithRef';

describe('useStateWithRef', () => {
    it('should keep state and ref in sync', () => {
        const { result } = renderHook(() => useStateWithRef<number>(0));

        const newValue = 1;

        act(() => {
            const [_getState, setState] = result.current;

            setState(newValue);
        });

        const [getState, _setState, state, ref] = result.current;

        expect(getState()).toBe(newValue);
        expect(state).toBe(newValue);
        expect(ref.current).toBe(newValue);
    });
});
