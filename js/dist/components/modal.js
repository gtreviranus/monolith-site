"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var keyCodes = {
  ESCAPE: 27
};
var selectors = {
  // unique
  MODAL_CONTAINER: "data-modal",
  MODAL_ID: "data-modal-id",
  MODAL_BUTTON: "data-modal-button",
  NO_SCROLL: "no-scroll",
  // common
  VISIBLE: "data-visible",
  CLOSE: "data-close",
  TARGET: "data-target",
  // accessibility
  ARIA_HIDDEN: "aria-hidden",
  ARIA_MODAL: "aria-modal",
  ROLE: "role",
  TAB_INDEX: "tabindex"
};
var events = {
  KEYDOWN: "keydown",
  CLICK: "click",
  RESIZE: "resize"
};
var messages = {
  MISSING_MODAL: "Your button is missing its corresponding modal. Check to make sure your modal is in the DOM, and that it has a [data-modal-id=*] attribute matchin its [data-modal-button] and [data-target] attributes. It's possible the modal script ran before the button appeared on the page!"
  /**
   * Modal component class.
   * @module Modal
   * @requires Utils
   */

};

var Modal =
/*#__PURE__*/
function (_Utils) {
  _inherits(Modal, _Utils);

  function Modal() {
    var _this;

    _classCallCheck(this, Modal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Modal).call(this)); // modal event methods

    _this._getModal = _this._getModal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._handleModalClose = _this._handleModalClose.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._handleEscapeKeyPress = _this._handleEscapeKeyPress.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._handleOverlayClick = _this._handleOverlayClick.bind(_assertThisInitialized(_assertThisInitialized(_this))); // all modals

    _this.modalContainerAttr = "[".concat(selectors.MODAL_CONTAINER, "]");
    _this.closeButtonAttr = "[".concat(selectors.MODAL_CONTAINER, "] [").concat(selectors.CLOSE, "]");
    _this.modals = null;
    _this.modalButtons = null;
    _this.closeButtons = null; // active modal

    _this.activeModalButton = {};
    _this.activeModalId = "";
    _this.activeModalOverlayAttr = "";
    _this.activeModalOverlay = {};
    _this.activeModalSelector = "";
    _this.activeModal = null;
    _this.activeModalCloseButtons = [];
    return _this;
  } // public

  /**
   * Add accessible attributes to modal containers
   * Begin listening to elements with [data-modal-button]
   */


  _createClass(Modal, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      this.modals = this._getElements(this.modalContainerAttr);
      this.modalButtons = this._getElements("[".concat(selectors.MODAL_BUTTON, "]"));
      this.closeButtons = this._getElements(this.closeButtonAttr);

      this._getFocusableElements(this.modalContainerAttr).forEach(function (element) {
        element.setAttribute(selectors.TAB_INDEX, "-1");
      });

      if (this.modals.length) {
        this.modals.forEach(function (modal) {
          modal.setAttribute(selectors.ARIA_MODAL, "true");
          modal.parentNode.setAttribute(selectors.ARIA_HIDDEN, "true");
          modal.parentNode.setAttribute(selectors.VISIBLE, "false");
          modal.setAttribute(selectors.ROLE, "dialog");
        });
      }

      if (this.modalButtons.length) {
        this.modalButtons.forEach(function (button) {
          button.addEventListener(events.CLICK, _this2._getModal);
        });
      }
    }
    /**
     * Stop listening to modal buttons
     */

  }, {
    key: "stop",
    value: function stop() {
      var _this3 = this;

      this.modalButtons.forEach(function (button) {
        button.removeEventListener(events.CLICK, _this3._getModal);
      });
    } // private

    /**
     * Locate a button's corresponding modal container.
     * @param {Object} event - The event object
     */

  }, {
    key: "_getModal",
    value: function _getModal(event) {
      event.preventDefault();

      this._renderModal(event);
    }
    /**
     * Find a button through event.target, then render the corresponding modal attribute via matching target id
     * @param {Object} event - The event object
     */

  }, {
    key: "_renderModal",
    value: function _renderModal(event) {
      var _this4 = this;

      this.activeModalButton = event.target;
      this.activeModalId = this.activeModalButton.getAttribute(selectors.TARGET);
      this.activeModalOverlayAttr = "[".concat(selectors.MODAL_ID, "='").concat(this.activeModalId, "']");
      this.activeModalOverlay = document.querySelector(this.activeModalOverlayAttr);

      if (!this.activeModalOverlay) {
        throw messages.MISSING_MODAL;
        return;
      }

      this.activeModalSelector = "".concat(this.activeModalOverlayAttr, " ").concat(this.modalContainerAttr);
      this.activeModal = document.querySelector(this.activeModalSelector);
      this.activeModalCloseButtons = this._getElements("".concat(this.activeModalOverlayAttr, " ").concat(this.closeButtonAttr));

      this._getFocusableElements(this.activeModalSelector).forEach(function (element) {
        element.setAttribute(selectors.TAB_INDEX, "0");
      });

      this._handleScrollStop();

      this.captureFocus(this.activeModalSelector);
      this.activeModalOverlay.setAttribute(selectors.ARIA_HIDDEN, "false");
      this.activeModal.setAttribute("tabindex", "-1");
      this.activeModalOverlay.setAttribute(selectors.VISIBLE, "true");
      this.activeModal.focus(); // offset slight scroll caused by this.activeModal.focus()

      this.activeModalOverlay.scrollTop = 0; // begin listening to events

      document.addEventListener(events.KEYDOWN, this._handleEscapeKeyPress);
      document.addEventListener(events.CLICK, this._handleOverlayClick);
      this.activeModalCloseButtons.forEach(function (button) {
        button.addEventListener(events.CLICK, _this4._handleModalClose);
      });
    }
    /**
     * Turn off event listeners and reset focus to last selected DOM node (button)
     * @param {Object} event - Event (keydown or click)
     */

  }, {
    key: "_handleModalClose",
    value: function _handleModalClose(event) {
      var _this5 = this;

      event.preventDefault();
      this.activeModalOverlay.setAttribute(selectors.VISIBLE, "false");

      this._handleReturnFocus();

      this._handleScrollRestore();

      this.releaseFocus();
      this.activeModalOverlay.setAttribute(selectors.ARIA_HIDDEN, "true");
      this.activeModal.removeAttribute("tabindex");

      this._getFocusableElements(this.activeModalSelector).forEach(function (element) {
        element.setAttribute(selectors.TAB_INDEX, "-1");
      }); // stop listening to events


      document.removeEventListener(events.KEYDOWN, this._handleEscapeKeyPress);
      document.removeEventListener(events.CLICK, this._handleOverlayClick);
      this.activeModalCloseButtons.forEach(function (button) {
        button.removeEventListener(events.CLICK, _this5._handleModalClose);
      });
    }
    /**
     * Handles click event on the modal background to close it.
     * @param {Object} event - Event (keydown)
     */

  }, {
    key: "_handleOverlayClick",
    value: function _handleOverlayClick(event) {
      if (event.target === this.activeModalOverlay) {
        this._handleModalClose(event);
      }
    }
    /**
     * Handles escape key event to close the current modal
     * @param {Object} event - Event (keydown)
     */

  }, {
    key: "_handleEscapeKeyPress",
    value: function _handleEscapeKeyPress(event) {
      if (event.which === keyCodes.ESCAPE) {
        this._handleModalClose(event);
      }
    }
    /**
     * Returns focus to the last focused element before the modal was called.
     * @param {Object} button - The current modal's corresponding button.
     */

  }, {
    key: "_handleReturnFocus",
    value: function _handleReturnFocus() {
      this.activeModalButton.setAttribute("tabindex", "-1");
      this.activeModalButton.focus();
      this.activeModalButton.removeAttribute("tabindex");
    }
    /**
     * Restores scroll behavior to <html> and <body>
     */

  }, {
    key: "_handleScrollRestore",
    value: function _handleScrollRestore() {
      document.body.classList.remove(selectors.NO_SCROLL);
      document.querySelector("html").classList.remove(selectors.NO_SCROLL);
    }
    /**
     * Prevents scroll behavior on <html> and <body>
     */

  }, {
    key: "_handleScrollStop",
    value: function _handleScrollStop() {
      document.body.classList.add(selectors.NO_SCROLL);
      document.querySelector("html").classList.add(selectors.NO_SCROLL);
    }
  }]);

  return Modal;
}(_utils.default);

exports.default = Modal;