Add a modal to add focus to your web experience. They are simple to set up and can be easily customized with CSS.

To use it, you must enable the javascript plugin near the end of the `<body>`:

```js
document.addEventListener("DOMContentLoaded", () => {
  Undernet.Modals.start()
})
```

### Attributes & Parts

Modals depend on a few base attributes, and the rest (including aria) is derived from there.

```html
<button href="#" data-modal-button data-target="new-modal">Open modal</button>
<div class="modal-overlay" data-modal-id="new-modal">
  <div aria-labelledby="header-id" data-modal>
    <header>
      <h2 class="h6" id="header-id">
        Modal Header
      </h2>
      <a data-close href="#">
        <span aria-hidden="true">&times;</span>
      </a>
    </header>
    <section>
      <p>Some modal content here</p>
    </section>
    <footer>
      <a class="button" data-close href="#">
        Cancel
      </a>
      <a class="primary button" href="#">
        OK
      </a>
    </footer>
  </div>
</div>
```

#### What's needed?
* `[data-modal-id]`: The unique id for the modal container.
* `[data-modal-button]`: An attribute with no value - lets the plugin know this is a button that opens a modal. Must have a data-target attached.
* `[data-target]`: Identifies the button as having a modal. It's value should match `[data-modal-id]`
* `[data-close]`: Adding this to a link or button automatically allows your modal to be closed on click.
* `modal-overlay` (class): Adds styling and animations to the overlay.

#### Accessibility
All main aria attributes are added automatically, with one exception:

* `[aria-labelledby]`: The inner modal container should have this attribute pointing to the header element's `id` attribute. This helps assistive technologies identify the title/label of the content.

Next: [Accordions ►](accordions)