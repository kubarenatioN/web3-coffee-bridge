import type { ChainType } from '@/shared/types/chains.types';
import type { ChainsReducerState } from './models';

export function chainsReducer(
  state: ChainsReducerState,
  action: { type: 'set_source_chain' | 'set_destination_chain'; chain: ChainType }
) {
  console.log(state, action);

  switch (action.type) {
    case 'set_source_chain': {
      if (action.chain === state.destinationChain) {
        return {
          ...state,
          sourceChain: action.chain,
          destinationChain: state.sourceChain,
        };
      }
      return {
        ...state,
        sourceChain: action.chain,
      };
    }

    case 'set_destination_chain': {
      if (action.chain === state.sourceChain) {
        return {
          ...state,
          destinationChain: action.chain,
          sourceChain: state.destinationChain,
        };
      }
      return {
        ...state,
        destinationChain: action.chain,
      };
    }
    default: {
      throw Error('Unknown action.');
    }
  }
}
