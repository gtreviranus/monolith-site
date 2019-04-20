"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireWildcard(require("./utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Selectors = {
  DATA_ACCORDION: "data-accordion",
  DATA_ACCORDION_ROW: "data-accordion-row",
  DATA_VISIBLE: "data-visible",
  DATA_TARGET: "data-target",
  DATA_TOGGLE_MULTIPLE: "data-toggle-multiple",
  DATA_PARENT: "data-parent",
  ARIA_EXPANDED: "aria-expanded",
  ARIA_CONTROLS: "aria-controls",
  ARIA_HIDDEN: "aria-hidden",
  ARIA_LABELLEDBY: "aria-labelledby",
  TABINDEX: "tabindex"
};
var Events = {
  CLICK: "click",
  KEYDOWN: "keydown"
};
var Messages = {
  NO_VISIBLE_ERROR: function NO_VISIBLE_ERROR(id) {
    return "Could not find parent with [data-visible] attribute associated with [data-target='".concat(id, "'].");
  },
  NO_ROW_ERROR: function NO_ROW_ERROR(id) {
    return "Could not find [data-accordion-row] associated with ".concat(id, ".");
  },
  NO_HEADER_ERROR: function NO_HEADER_ERROR(attr) {
    return "Could not find header associated with ".concat(attr, ".");
  },
  NO_HEADER_ID_ERROR: function NO_HEADER_ID_ERROR(attr) {
    return "Could not find an id on your header associated with ".concat(attr, ".");
  },
  NO_PARENT_ERROR: function NO_PARENT_ERROR(id) {
    return "Could not find [data-parent] associated with [data-target='".concat(id, "'].");
  },
  NO_CONTENT_ERROR: function NO_CONTENT_ERROR(id) {
    return "Could not find accordion content block with [id] ".concat(id, " associated with [data-target='").concat(id, "'].");
  }
};

var Accordion = function (_Utils) {
  _inherits(Accordion, _Utils);

  function Accordion() {
    var _this;

    _classCallCheck(this, Accordion);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Accordion).call(this));
    _this._render = _this._render.bind(_assertThisInitialized(_this));
    _this._accordionButtons = [];
    _this._accordionContentsAttr = "";
    _this._accordionContents = [];
    _this._activeContainer = {};
    _this._activeButton = {};
    _this._activeAccordionRowId = "";
    _this._activeRowAttr = "";
    _this._activeRow = "";
    _this._activeContainerId = "";
    _this._activeContainerAttr = "";
    _this._activeContent = {};
    _this._activeButtonExpandState = "";
    _this._activeContentHiddenState = "";
    _this._headerLevels = ["h1", "h2", "h3", "h4", "h5", "h6"];
    return _this;
  }

  _createClass(Accordion, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      var accordionButtonSelector = this._getPossibleAccordionButtonAttr("[".concat(Selectors.DATA_ACCORDION, "]"));

      this._accordionButtons = (0, _utils.nodeListToArray)(accordionButtonSelector);

      if (this._accordionButtons.length) {
        this._accordionButtons.forEach(function (button) {
          _this2._setupAccordion(button);

          button.addEventListener(Events.CLICK, _this2._render);
        });
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      var _this3 = this;

      this._accordionButtons.forEach(function (button) {
        button.removeEventListener(Events.CLICK, _this3._render);
      });
    }
  }, {
    key: "_setupAccordion",
    value: function _setupAccordion(button) {
      var buttonId = button.getAttribute(Selectors.DATA_TARGET);
      var buttonContent = document.getElementById(buttonId);

      if (!buttonContent) {
        throw new Error(Messages.NO_CONTENT_ERROR(buttonId));
      }

      var accordionRowAttr = this._getAccordionRowAttr(buttonId);

      var accordionRow = document.querySelector(accordionRowAttr);

      if (!accordionRow) {
        throw new Error(Messages.NO_ROW_ERROR(buttonId));
      }

      var buttonHeaderAttr = this._getHeadersSelector(accordionRowAttr);

      var buttonHeader = accordionRow.querySelector(buttonHeaderAttr);

      if (!buttonHeader) {
        throw new Error(Messages.NO_HEADER_ERROR(accordionRowAttr));
      }

      if (!buttonHeader.id) {
        throw new Error(Messages.NO_HEADER_ID_ERROR(accordionRowAttr));
      }

      var buttonContentChildren = (0, _utils.getFocusableElements)("#".concat(buttonContent.id));
      button.setAttribute(Selectors.ARIA_CONTROLS, buttonId);
      buttonContent.setAttribute(Selectors.ARIA_LABELLEDBY, buttonHeader.id);
      var contentShouldExpand = accordionRow.getAttribute(Selectors.DATA_VISIBLE);

      if (!contentShouldExpand) {
        throw new Error(Messages.NO_VISIBLE_ERROR(buttonId));
      }

      if (contentShouldExpand === "true") {
        buttonContent.style.maxHeight = "".concat(buttonContent.scrollHeight, "px");
        button.setAttribute(Selectors.ARIA_EXPANDED, "true");
        buttonContent.setAttribute(Selectors.ARIA_HIDDEN, "false");
        buttonContentChildren.forEach(function (element) {
          element.setAttribute(Selectors.TABINDEX, "0");
        });
      } else {
        button.setAttribute(Selectors.ARIA_EXPANDED, "false");
        buttonContent.setAttribute(Selectors.ARIA_HIDDEN, "true");
        buttonContentChildren.forEach(function (element) {
          element.setAttribute(Selectors.TABINDEX, "-1");
        });
      }
    }
  }, {
    key: "_render",
    value: function _render(event) {
      event.preventDefault();
      this._activeButton = event.target;

      this._setIds();

      this._setActiveRow();

      if (!this._activeContainerId) {
        throw new Error(Messages.NO_PARENT_ERROR(this._activeAccordionRowId));
      }

      this._setActiveContainer();

      if (!this._activeContainer) {
        throw new Error(Messages.NO_ACCORDION_ERROR(this._activeContainerId));
      }

      this._setActiveContent();

      this._setVisibleState();

      var canExpandMultiple = this._activeContainer.hasAttribute(Selectors.DATA_TOGGLE_MULTIPLE);

      if (!canExpandMultiple) {
        this._closeAllIfToggleable();
      }

      this._toggleSelectedAccordion();

      this._activeRow = null;
      this._activeButton = null;
      this._activeContent = null;
      this._activeContainer = null;
    }
  }, {
    key: "_setActiveContent",
    value: function _setActiveContent() {
      this._activeContent = document.getElementById(this._activeAccordionRowId);
    }
  }, {
    key: "_setVisibleState",
    value: function _setVisibleState() {
      var accordionButtonState = this._activeRow.getAttribute(Selectors.DATA_VISIBLE);

      this._nextButtonExpandState = accordionButtonState === "true" ? "false" : "true";
      this._nextContentHiddenState = this._nextButtonExpandState === "false" ? "true" : "false";
    }
  }, {
    key: "_setIds",
    value: function _setIds() {
      this._activeContainerId = this._activeButton.getAttribute(Selectors.DATA_PARENT);
      this._activeAccordionRowId = this._activeButton.getAttribute(Selectors.DATA_TARGET);
    }
  }, {
    key: "_setActiveContainer",
    value: function _setActiveContainer() {
      this._activeContainerAttr = "[".concat(Selectors.DATA_ACCORDION, "='").concat(this._activeContainerId, "']");
      this._activeContainer = document.querySelector(this._activeContainerAttr);
    }
  }, {
    key: "_setActiveRow",
    value: function _setActiveRow() {
      this._activeRowAttr = this._getAccordionRowAttr(this._activeAccordionRowId);
      this._activeRow = document.querySelector(this._activeRowAttr);
    }
  }, {
    key: "_getPossibleAccordionButtonAttr",
    value: function _getPossibleAccordionButtonAttr(attr) {
      return this._headerLevels.map(function (header) {
        return "".concat(attr, " > [").concat(Selectors.DATA_ACCORDION_ROW, "] > ").concat(header, " [").concat(Selectors.DATA_TARGET, "]");
      }).join(", ");
    }
  }, {
    key: "_getHeadersSelector",
    value: function _getHeadersSelector() {
      return this._headerLevels.join(", ");
    }
  }, {
    key: "_getAccordionRowAttr",
    value: function _getAccordionRowAttr(id) {
      return "[".concat(Selectors.DATA_ACCORDION_ROW, "='").concat(id, "']");
    }
  }, {
    key: "_closeAllIfToggleable",
    value: function _closeAllIfToggleable() {
      var _this4 = this;

      var allContentAttr = "".concat(this._activeContainerAttr, " > [").concat(Selectors.DATA_ACCORDION_ROW, "] > [").concat(Selectors.ARIA_HIDDEN, "]");

      var accordionButtonSelector = this._getPossibleAccordionButtonAttr(this._activeContainerAttr);

      var allButtons = (0, _utils.nodeListToArray)(accordionButtonSelector);
      var allContent = (0, _utils.nodeListToArray)(allContentAttr);
      var allRows = (0, _utils.nodeListToArray)("".concat(this._activeContainerAttr, " > [").concat(Selectors.DATA_ACCORDION_ROW, "]"));
      allContent.filter(function (content) {
        return content !== _this4._activeContent;
      }).forEach(function (content) {
        return content.style.maxHeight = null;
      });
      (0, _utils.getFocusableElements)(allContentAttr).forEach(function (element) {
        element.setAttribute(Selectors.TABINDEX, "-1");
      });

      this._toggleAttributeInCollection(allRows, Selectors.DATA_VISIBLE, "false");

      this._toggleAttributeInCollection(allButtons, Selectors.ARIA_EXPANDED, "false");

      this._toggleAttributeInCollection(allContent, Selectors.ARIA_HIDDEN, "true");
    }
  }, {
    key: "_toggleSelectedAccordion",
    value: function _toggleSelectedAccordion() {
      var _this5 = this;

      this._activeRow.setAttribute(Selectors.DATA_VISIBLE, this._nextButtonExpandState);

      this._activeButton.setAttribute(Selectors.ARIA_EXPANDED, this._nextButtonExpandState);

      this._activeContent.setAttribute(Selectors.ARIA_HIDDEN, this._nextContentHiddenState);

      (0, _utils.getFocusableElements)("#".concat(this._activeAccordionRowId)).forEach(function (element) {
        var value = _this5._nextButtonExpandState === "true" ? "0" : "-1";
        element.setAttribute(Selectors.TABINDEX, value);
      });

      if (this._activeContent.style.maxHeight) {
        this._activeContent.style.maxHeight = null;
      } else {
        this._activeContent.style.maxHeight = "".concat(this._activeContent.scrollHeight, "px");
      }
    }
  }, {
    key: "_toggleAttributeInCollection",
    value: function _toggleAttributeInCollection(elements, attributeName, newValue) {
      elements.forEach(function (element) {
        return element.setAttribute(attributeName, newValue);
      });
    }
  }]);

  return Accordion;
}(_utils.default);

exports.default = Accordion;
//# sourceMappingURL=accordion.js.map