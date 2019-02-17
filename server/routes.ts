import * as express from 'express';

import UserCtrl from './controllers/user';
import SerialCtrl from './controllers/serial';
import LogCtrl from './controllers/log';
import User from './models/user';
import {checkJWT} from "./utils/auth";

export default function setRoutes(app) {

  const router = express.Router();

  const serialCtrl = new SerialCtrl();

  const userCtrl = new UserCtrl();
  const logCtrl = new LogCtrl(serialCtrl.getUpdates());

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  router.route('/logs').get((req, res) => {
    const date1 = parseInt(req.query.dateStart, 10);
    const date2 = parseInt(req.query.dateEnd, 10);

    if (!isNaN(date1) && !isNaN(date2) && date1 < date2) {
      logCtrl.getInRange(date1, date2).then(
        (docs) => {
          res.status(200).json(docs);
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
    }
  });

  router.route('/status').get((req, res) => {
    logCtrl.getLatest().then(
      (docs) => {
        res.status(200).json(docs);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  });

  router.route('/status').post((req, res) => {
    // if (!checkJWT(req)) {
    //   res.status(403).json({ error: 'Login required!' });
    //   return;
    // }

    serialCtrl.write(req.body).then(
      () => {
        res.sendStatus(200);
      },
      (err) => {
        res.sendStatus(400);
        return console.error(err);
      }
    );
  });

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
