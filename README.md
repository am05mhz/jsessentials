# errand
small javascript library

## Usage

### AJAX
#### Get json
```javascript
x_x.errand({
    url: 'json-url',
    json: true
}).success(function(result) {
    console.log(result);
});
```

#### Post data
```javascript
x_x.errand({
    url: 'post-url',
    method: 'post',
    data: {
        somedata: 'somevalue'
    }
}).success(function(result) {
    console.log(result);
}).error(function(message) {
    console.log(message);
});
```

#### Custom headers
```javascript
somedata = {postdata: 'postvalue'}
x_x.errand({
    url: 'post-url',
    method: 'post',
    data: somedata,
    headers : {
        someheader: 'some header value'
    }
}).success(function(result) {
    console.log(result);
});
```

#### Abort/cancel request
```javascript
var req = x_x.errand('http://abc.com');
req.cancel()
```

### Extend object
```javascript
x_x.extends({}, {someProperty: 'someValue'});
```

### Type checks
```javascript
someVar = {};
x_x.isVarTypeOf(someVar, Object); //true
x_x.isVarTypeOf(someVar, Array); //false
```

### Attach events
```javascript
x_x(window).on('ready', function(){ console.log('doc ready') });
```
