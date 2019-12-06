import { getRegistration } from '../utils/data';
import { Request } from 'firebase-functions';
import { messaging } from 'firebase-admin';
import * as Joi from '@hapi/joi';

export const push = async (req: Request): Promise<IResponse> => {
    try {
        // validate POST data
        await Joi.object({
          topic: Joi.string().uuid().required()
        }).validateAsync(req.body);

        // get push notification settings for selected topic
        const registration = await getRegistration(req.body.topic);

        // send push notification
        await messaging()
          .send({
            token: registration.token,
            notification: {
              body: `New call request from ${registration.peerName}`
            },
            data: {
              bridge: registration.bridge,
              topic: registration.topic
            }
          });

          return {
            code: 200, 
            success: true
          }
    } catch (error) {
        return {
          code: 500, 
          success: false,
          errorMessage: error.message || error,
        }
    }
}