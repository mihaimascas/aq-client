import * as jwt from 'jsonwebtoken';

export const checkJWT = (req) => {
  let isValid = false;
  let token = '';
  let decoded;
  
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');

    try {
      decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      
      if (decoded && decoded.user && decoded.user._id && decoded.user.role) {
        isValid = true;
      }
      
    } catch (e) {
      isValid = false;
    }
  }
  
  return isValid;
};
