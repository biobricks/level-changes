
Returns a stream of changes to a leveldb database.

# Usage

```
var db = level('foo');
var c = changes(db, [opts]);
c.on('data', function(change) {
  console.log("Change:", change)
})
```

The change objects emitted have the properties:

```
{
  type: 'put', // or 'del'
  key: <key>,
  value: <value> // only present if type is 'put'
}
```

If {history: true} is set in opts then the stream will first output a 'put' change for each row already present in the database.

