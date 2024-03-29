
var through = require('through2');
var xtend = require('xtend');

function changes(db, opts) {
  opts = xtend({
    history: false,
    gte: undefined,
    lte: undefined
  }, opts || {});

  opts.gte = opts.gte || opts.start;
  opts.lte = opts.lte || opts.end;

  var out = through.obj();

  db.on('put', function(key, value) {
    if(opts.gte && key < opts.gte) return;
    if(opts.lte && key > opts.lte) return;
    out.write({
      type: 'put',
      key: key,
      value: value
    });
  });

  db.on('del', function(key) {
    if(opts.gte && key < opts.gte) return;
    if(opts.lte && key > opts.lte) return;
    out.write({
      type: 'del',
      key: key
    });
  });

  db.on('batch', function(objs) {
    var i, cur;
    for(i=0; i < objs.length; i++) {
      cur = objs[i];
      if(opts.gte && cur.key < opts.gte) return;
      if(opts.lte && cur.key > opts.lte) return;
      out.write(cur);
    }
  });

  if(opts.history) {
    var dbs = db.createReadStream(opts);
    dbs.on('data', function(data) {
      out.write({
        type: 'put',
        key: data.key,
        value: data.value
      });      
    });
  }

  return out;
}

module.exports = changes;
