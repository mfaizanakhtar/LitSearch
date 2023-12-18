import { create } from 'zustand'
import Paper from './interfaces'

interface State {
    session: string
    query: string
    cmdOpened: boolean
    papers: Array<Paper>
    add: (papers: Array<Paper>) => void
}

const getState = create<State>()((set) => ({
    session: '',
    query: '',
    cmdOpened: false,
    papers: [],
    add: (papers: Array<Paper>) => set((state) => ({ papers: papers.concat(state.papers) })),
}))

export default getState;