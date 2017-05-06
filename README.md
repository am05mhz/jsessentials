# errand
small javascript library

## Usage

### Get json
```javascript
x_x.errand({
    url: 'json-url',
    json: true
}).success(function(result) {
    console.log(result);
});
```

### Post data
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

### Custom headers
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
x_x.on(window, 'ready', function(){ console.log('doc ready') });
```
