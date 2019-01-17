import { config } from '../../configuration/config'
export const LOOKING_AT = (state = '', action) => {
  switch (action.type) {
    case 'LOOKING_AT':
      return config[action.payload.status].text[action.payload.language];
    case 'DONT_LOOK':
      return '';
    default:
      return state;
  }
};
