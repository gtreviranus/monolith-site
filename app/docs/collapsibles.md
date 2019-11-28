Use a collapsible to hide or show content.

If you wish to wrap multiple collapsibles together like an accordion, head over to the [accordion documentation](/docs/components/collapsibles) to learn how.

## Basic Collapsible

Check out this example collapsible:

<div class="collapsible" data-collapsible="collapsible-1">
  <h5>
    <button class="collapsible-trigger" id="trigger-1" data-target="collapsible-1">
      Press to collapse
    </button>
  </h5>
  <div class="collapsible-content" id="collapsible-1">
    <p class="has-p">
      It's just lorem ipsum. Consectetur eiusmod laboris in non id tempor exercitation ipsum cupidatat magna ipsum ut voluptate. <a>A link,</a> and <a>another link!</a>
    </p>
  </div>
</div>
<br/>

```html
<div class="collapsible" data-collapsible="collapsible-id">
  <h5>
    <button class="collapsible-trigger" id="collapsible-trigger-id" data-target="collapsible-id">
      Accordion Button 1
    </button>
  </h5>
  <div class="collapsible-content" id="collapsible-id">
    <p class="has-p">
      Consectetur eiusmod laboris in non id tempor exercitation ipsum cupidatat magna ipsum ut
      voluptate.
    </p>
  </div>
</div>
```

Avoid adding margin or padding directly to the collapsible content element; this may change the calculated dimensions and break the collapse behavior.

Instead, add a new element inside with its own margin/padding.

## Controlling Visibility

Any given collapsible's content will be expanded by default. To force the content to be hidden, add `data-visible="false"` on the wrapper.

<div class="collapsible" data-visible="false" data-collapsible="collapsible-2">
  <h5>
    <button class="collapsible-trigger" id="trigger-2" data-target="collapsible-2">
      Open for cake
    </button>
  </h5>
  <div class="collapsible-content" id="collapsible-2">
    <p class="has-p">
      Sorry, just gibberish. Consectetur eiusmod laboris in non id tempor exercitation ipsum cupidatat magna ipsum ut voluptate. <a>A link,</a> and <a>another link!</a>
    </p>
  </div>
</div>
<br/>

```html
<div class="collapsible" data-collapsible="collapsible-id" data-visible="false">
  ...
</div>
```

## Focusable Content

If you include links, buttons, or other focusable elements within collapsible content, it will get `tabindex="-1"` put on it to prevent focus by keyboards.

## Requirements

Two main pieces are required: an API call and correct HTML markup.

### HTML

A collapsible needs a few attributes and classes to work correctly. A strict HTML structure is needed for accessibility.

```html
<div class="collapsible" data-collapsible="collapsible-id">
  <h5>
    <button class="collapsible-trigger" id="collapsible-trigger-id" data-target="collapsible-id">
      ...
    </button>
  </h5>
  <div class="collapsible-content" id="collapsible-id">
    ...
  </div>
</div>
```

#### Primary Attributes

- `data-collapsible`: an attribute for a collapsible component within a `data-accordion` wrapper. It should have a unique value matching a trigger's `data-target` attribute.
- `data-target`: an attribute on a trigger. It should have a value equal to the collapsible content's `id` attribute.
- `data-visible`: an attribute denoting if collapsible content is visible; `null` by default. Set to `true` if you want the collapsible to be expanded on page load.

#### Accessibility

A few key attributes are added for you when the accordion is instantiated. These help assistive technologies know how to treat and navigate through the component.

- `aria-labelledby`: an attribute added to collapsible content, telling assistive technologies the content is associated with its corresponding trigger.
- `aria-controls`: an attribute added to a trigger, telling assistive technologies which content block corresponds to it.
- `aria-expanded`: an attribute added to a trigger, telling assistive technologies if collapsible content is visible.
- `aria-hidden`: an attribute added to collapsible content, telling assistive technologies that the element can be ignored if it's set to `true`.

In addition, a header tag must wrap the collapsible trigger. The trigger must be a `button` element.

[See WAI-ARIA documentation](https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html) on best-practices for the collapse UI pattern.

#### Styling Classes

- `collapsible`: adds special styling for a trigger and content block.
- `collapsible-trigger`: adds styling for a trigger.
- `collapsible-content`: adds styling for a collapsible content block.

### API

Call one of the following scripts from Undernet's JavaScript (not both!). This should happen _only once_ on page load/component mount/etc.

```js
Undernet.start()
```

```js
Undernet.Collapsibles.start()
```

---
<p class="has-text-end">Is this article inaccurate? <a href="https://github.com/geotrev/undernet/tree/master/app/docs/collapsible.md">Edit this page on Github!</a></p>