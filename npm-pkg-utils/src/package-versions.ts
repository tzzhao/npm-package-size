import * as npm from 'npm';
import semver = require('semver/preload');

export function view(name: string, cb: Function) {
  if (!name.length)
    return new Error('Bad name parameter, empty string.');

  npm.load({ loglevel: 'silent' }, function (err) {

    if (err) return cb(err);

    const silent = true;      // make npm not chatty on stdout
    npm.commands.view([name], silent, function (err, data) {
      if (err) return cb(err);
      if (!data) return cb(new Error('No data received.'));

      for (const p in data) {
        if (!data.hasOwnProperty(p) ||!semver.valid(p))
          continue;
        return cb(null, p, data[p]);
      }
      return cb(new Error('Bad data received: ' + data));
    });
  });
}
