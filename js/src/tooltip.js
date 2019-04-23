import { iOSMobile } from "./utils"

const KeyCodes = {
  ESCAPE: 27,
}

const Selectors = {
  // unique
  DATA_TOOLTIP: "data-tooltip",
  // common
  DATA_VISIBLE: "data-visible",
  DATA_TARGET: "data-target",
  // accessibility
  ROLE: "role",
  ARIA_DESCRIBEDBY: "aria-describedby",
  // classes
  DROP_LEFT_CLASS: "is-drop-left",
  DROP_RIGHT_CLASS: "is-drop-right",
}

const Events = {
  CLICK: "click",
  MOUSEOVER: "mouseover",
  MOUSEOUT: "mouseout",
  FOCUS: "focus",
  BLUR: "blur",
  KEYDOWN: "keydown",
}

const Messages = {
  NO_ID_ERROR: "Could not find your tooltip's id.",
  NO_TRIGGER_ERROR: id => `Could not find a tooltip trigger with id of ${id}.`,
  NO_TOOLTIP_ERROR: id => `Could not find a tooltip with id of ${id}.`,
}

export default class Tooltip {
  constructor() {
    // events
    this._render = this._render.bind(this)
    this._handleClose = this._handleClose.bind(this)
    this._handleEscapeKeyPress = this._handleEscapeKeyPress.bind(this)

    // active tooltip
    this._activeTrigger = null
    this._activeTooltip = null

    // all tooltips
    this._allTooltips = []
  }

  // public

  start() {
    this._allTooltips = document.querySelectorAll(`[${Selectors.DATA_TOOLTIP}]`)

    this._allTooltips.forEach(instance => {
      this._setup(instance)
    })
  }

  stop() {
    this._allTooltips.forEach(instance => {
      const id = instance.getAttribute(Selectors.DATA_TOOLTIP)
      const trigger = instance.querySelector(this._getTrigger(id))

      if (this._activeTooltip || this._activeTrigger) {
        this._handleClose()
      }

      trigger.removeEventListener(Events.MOUSEOVER, this._render)
      trigger.removeEventListener(Events.FOCUS, this._render)
    })
  }

  // private

  _setup(instance) {
    const id = instance.getAttribute(Selectors.DATA_TOOLTIP)

    if (!id) {
      throw new Error(Messages.NO_ID_ERROR)
    }

    const trigger = instance.querySelector(this._getTrigger(id))
    const tooltip = instance.querySelector(`#${id}`)

    if (!trigger) {
      throw new Error(Messages.NO_TRIGGER_ERROR(id))
    }

    if (!tooltip) {
      throw new Error(Messages.NO_TOOLTIP_ERROR(id))
    }

    trigger.setAttribute(Selectors.ARIA_DESCRIBEDBY, id)
    tooltip.setAttribute(Selectors.ROLE, "tooltip")
    trigger.addEventListener(Events.MOUSEOVER, this._render)
    trigger.addEventListener(Events.FOCUS, this._render)
  }

  _render(event) {
    this._activeTrigger = event.target
    const tooltipId = this._activeTrigger.getAttribute(Selectors.DATA_TARGET)
    this._activeTooltip = document.getElementById(tooltipId)

    // align tooltip to its trigger
    // -> if the trigger is on the left or right side, use height
    // -> else use width
    if (this._isLeftOrRight()) {
      this._alignTooltip("height")
    } else {
      this._alignTooltip("width")
    }

    this._showTooltip()
    this._listenForClose()
  }

  _handleClose() {
    this._hideTooltip()
    this._listenForOpen()

    this._activeTrigger = null
    this._activeTooltip = null
  }

  _showTooltip() {
    this._activeTooltip.setAttribute(Selectors.DATA_VISIBLE, "true")
  }

  _hideTooltip() {
    this._activeTooltip.setAttribute(Selectors.DATA_VISIBLE, "false")
  }

  _listenForClose() {
    this._activeTrigger.removeEventListener(Events.MOUSEOVER, this._render)
    this._activeTrigger.removeEventListener(Events.FOCUS, this._render)
    this._activeTrigger.addEventListener(Events.MOUSEOUT, this._handleClose)
    this._activeTrigger.addEventListener(Events.BLUR, this._handleClose)
    document.addEventListener(Events.KEYDOWN, this._handleEscapeKeyPress)

    if (iOSMobile) {
      document.body.style.cursor = "pointer"
    }
  }

  _handleEscapeKeyPress(event) {
    if (event.which === KeyCodes.ESCAPE) {
      this._handleClose()
    }
  }

  _listenForOpen() {
    this._activeTrigger.removeEventListener(Events.MOUSEOUT, this._handleClose)
    this._activeTrigger.removeEventListener(Events.BLUR, this._handleClose)
    this._activeTrigger.addEventListener(Events.MOUSEOVER, this._render)
    this._activeTrigger.addEventListener(Events.FOCUS, this._render)
    document.removeEventListener(Events.KEYDOWN, this._handleEscapeKeyPress)

    if (iOSMobile) {
      document.body.style.cursor = "auto"
    }
  }

  _alignTooltip(property) {
    const triggerLength = this._getComputedLength(this._activeTrigger, property)
    const tooltipLength = this._getComputedLength(this._activeTooltip, property)
    const triggerIsLongest = triggerLength > tooltipLength

    const offset = triggerIsLongest
      ? (triggerLength - tooltipLength) / 2
      : (tooltipLength - triggerLength) / -2

    if (property === "height") {
      this._activeTooltip.style.top = `${offset}px`
    } else {
      this._activeTooltip.style.left = `${offset}px`
    }
  }

  _getTrigger(id) {
    return `[${Selectors.DATA_TARGET}="${id}"]`
  }

  _getComputedLength(element, property) {
    return Math.floor(element.getBoundingClientRect()[property])
  }

  _isLeftOrRight() {
    const classes = this._activeTooltip.classList
    return (
      classes.contains(Selectors.DROP_LEFT_CLASS) || classes.contains(Selectors.DROP_RIGHT_CLASS)
    )
  }
}
