<img src=".github/img/logo.svg" width="80px" align="right" />

# lucia

> Currently in heavy development. Do not use in production

tiny javascript library for web applications

<br>

## install

put this at the end of your body or in your head tags.

```html
<script src="https://unpkg.com/lucia"></script>
```

## usage

Templating:
```html
<div id="app">
  <p>{{ hello }}</p>
  <p>{{ hello === 'world' }}</p>
</div>
<script src="https://unpkg.com/lucia"></script>
<script>
  const lucia = new Lucia({
    el: '#app',
    data: {
      hello: 'world'
    }
  });

  lucia.data.set('hello', 'there'); // Change data
  lucia.nextTick(); // Repaint
</script>
```

Event Handlers:
```html
<div id="app">
  <button l-on:click="alert(message)">{{ message }}</button>
</div>
<script src="https://unpkg.com/lucia"></script>
<script>
  const lucia = new Lucia({
    el: '#app',
    data: {
      message: 'hello world'
    }
  });
</script>
```