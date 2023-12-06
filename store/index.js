import {create} from 'zustand';

const useStore = create(set => ({
  // Define your state and actions here
  count: 0,
  increaseCount: () => set(state => ({ count: state.count + 1 })),
  decreaseCount: () => set(state => ({ count: state.count - 1 })),
}));

export default useStore;