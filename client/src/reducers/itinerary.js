import { SAVE_ITIN, SAVE_ITIN_DB, GET_ITINS,GET_ITIN, ITIN_LOADING, CLEAR_CURRENT_ITIN, GET_ITINS_INVITED } from '../constants/action-types';
import axios from 'axios';

const initialState = {
  itinerary: {},
  itineraries: [],
  itinerariesInvited: [],
  loading: true
};

function itineraryReducer(state = initialState, action) {
  // Add payload of current itinerary to itinerary state object
  if (action.type === SAVE_ITIN) {
    
    var newItin = Object.assign(state.itinerary, action.payload);
    return Object.assign({}, state, { itinerary: newItin }, { loading: false });
  }


  if (action.type === GET_ITIN) {
    return {
      ...state,
      itinerary: action.payload,
      loading: false
    }
  }


  if (action.type === GET_ITINS) {
    return {
      ...state,
      itineraries: action.payload,
      loading: false
    }
  }

  if (action.type === GET_ITINS_INVITED) {
    return {
      ...state,
      itinerariesInvited: action.payload,
      loading: false
    }
  }

  if (action.type === CLEAR_CURRENT_ITIN) {
    return {
      ...state,
      itinerary: {}
    }
  }

  if (action.type === ITIN_LOADING) {
    return {
      ...state,
      loading: true
    }
  }

  return state;
};

export default itineraryReducer;