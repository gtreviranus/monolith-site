import {
  isiOSMobile,
  createFocusTrap,
  focusOnce,
  queryAll,
  log,
  ComponentEngine,
  layerManager,
} from "../helpers"
import { KeyCodes, Selectors, Events, Messages } from "./constants"

/**
 * Class that instantiates or destroys all instances of dropdown components on a page.
 *
 * @module Dropdown
 */
export default class Dropdown {
  constructor() {
    // events
    this._handleClick = this._handleClick.bind(this)
    this._handleFirstTabClose = this._handleFirstTabClose.bind(this)
    this._handleLastTabClose = this._handleLastTabClose.bind(this)
    this._handleArrowKeyPress = this._handleArrowKeyPress.bind(this)
    this._handleLayerDismiss = this._handleLayerDismiss.bind(this)
    this._handleClose = this._handleClose.bind(this)
    this._validate = this._validate.bind(this)
    this._teardown = this._teardown.bind(this)

    // all dropdowns
    this._components = []

    // active dropdown
    this._activeDropdownId = ""
    this._activeDropdownAttr = ""
    this._activeDropdownMenuId = ""
    this._activeDropdown = null
    this._activeTrigger = null
    this._activeDropdownMenu = null
    this._firstDropdownAction = null
    this._lastDropdownAction = null
    this._focusTrap = null
    this._activeDropdownActions = []
    this._allowFocusReturn = true

    // dropdown element selectors
    this._dropdownContainerAttr = `[${Selectors.DATA_DROPDOWN}]`
    this._dropdownTargetAttr = `[${Selectors.DATA_TARGET}]`
    this._dropdownMenuClassName = `.${Selectors.DROPDOWN_MENU_CLASS}`
  }

  // public

  start(id) {
    ComponentEngine.start({ id, attribute: Selectors.DATA_DROPDOWN, thisArg: this })
  }

  stop(id) {
    ComponentEngine.stop({
      id,
      attribute: Selectors.DATA_DROPDOWN,
      thisArg: this,
      activeNodeKey: "_activeDropdown",
      cancelActiveFn: "_closeActiveDropdown",
    })
  }

  // private

  _validate(instance) {
    const dropdownId = instance.getAttribute(Selectors.DATA_DROPDOWN)

    if (!dropdownId) {
      log(Messages.NO_DROPDOWN_ID_ERROR)
      return false
    }

    const dropdownAttr = `[${Selectors.DATA_DROPDOWN}="${dropdownId}"]`
    const dropdown = document.querySelector(`[${Selectors.DATA_DROPDOWN}="${dropdownId}"]`)

    // no trigger error!

    const dropdownTrigger = dropdown.querySelector(`[${Selectors.DATA_TARGET}]`)

    if (!dropdownTrigger.getAttribute(Selectors.DATA_PARENT)) {
      log(Messages.NO_PARENT_ERROR)
      return false
    }

    const dropdownMenuId = dropdownTrigger.getAttribute(Selectors.DATA_TARGET)

    // no target error!

    const dropdownMenu = dropdown.querySelector(`#${dropdownMenuId}`)

    if (!dropdownMenu) {
      log(Messages.NO_MENU_ERROR(dropdownAttr))
      return false
    }

    dropdownMenu.setAttribute(Selectors.ARIA_LABELLEDBY, dropdownTrigger.id)

    dropdownTrigger.setAttribute(Selectors.ARIA_CONTROLS, dropdownMenuId)
    dropdownTrigger.setAttribute(Selectors.ARIA_HASPOPUP, "true")
    dropdownTrigger.setAttribute(Selectors.ARIA_EXPANDED, "false")

    const dropdownMenuListItems = dropdown.querySelectorAll(`#${dropdownMenuId} > li`)

    if (!dropdownMenuListItems.length) {
      log(Messages.NO_DROPDOWN_ITEMS_ERROR(dropdownAttr))
      return false
    }

    const dropdownMenuActions = this._getDropdownActions(dropdownAttr, `#${dropdownMenuId}`)

    if (!dropdownMenuActions.length) {
      log(Messages.NO_DROPDOWN_ACTIONS_ERROR(dropdownAttr))
      return false
    }

    dropdownMenuActions.forEach(trigger => {
      trigger.setAttribute(Selectors.TABINDEX, "-1")
    })

    dropdownTrigger.addEventListener(Events.CLICK, this._handleClick)
    dropdownTrigger.addEventListener(Events.KEYDOWN, this._handleArrowKeyPress)

    return true
  }

  _teardown(instance) {
    const id = instance.getAttribute(Selectors.DATA_DROPDOWN)
    const trigger = instance.querySelector(`[${Selectors.DATA_PARENT}='${id}']`)

    trigger.removeEventListener(Events.CLICK, this._handleClick)
    trigger.removeEventListener(Events.KEYDOWN, this._handleArrowKeyPress)
  }

  _handleClick(event, key) {
    event.preventDefault()
    event.stopPropagation()
    this._closeOpenDropdowns(event)

    this._activeTrigger = event.target

    this._setActiveDropdownId()
    this._setActiveDropdown()
    this._setActiveDropdownMenu()
    this._setVisibleState()
    this._startActiveDropdownEvents()

    if (key && key === KeyCodes.ARROW_UP) {
      this._lastDropdownAction.focus()
    } else {
      this._firstDropdownAction.focus()
    }

    if (isiOSMobile) document.body.classList.add(Selectors.OVERLAY_OPEN)
  }

  _handleClose() {
    if (this._allowFocusReturn) this._handleReturnFocus()
    this._closeActiveDropdown()
  }

  _closeActiveDropdown() {
    layerManager.remove(this._activeDropdownId)
    if (isiOSMobile) document.body.classList.remove(Selectors.OVERLAY_OPEN)

    this._activeDropdown.setAttribute(Selectors.DATA_VISIBLE, "false")
    this._activeTrigger.setAttribute(Selectors.ARIA_EXPANDED, "false")

    this._activeTrigger.removeEventListener(Events.CLICK, this._handleClose)
    this._activeTrigger.addEventListener(Events.CLICK, this._handleClick)
    this._firstDropdownAction.removeEventListener(Events.KEYDOWN, this._handleFirstTabClose)
    this._lastDropdownAction.removeEventListener(Events.KEYDOWN, this._handleLastTabClose)

    this._activeDropdownActions.forEach(action => {
      action.setAttribute(Selectors.TABINDEX, "-1")
      action.removeEventListener(Events.CLICK, this._handleClose)
    })

    this._focusTrap.stop()
    this._focusTrap = null

    this._resetProperties()
  }

  _resetProperties() {
    this._activeDropdownId = ""
    this._activeDropdownAttr = ""
    this._activeDropdownMenuId = ""
    this._activeDropdown = null
    this._activeTrigger = null
    this._activeDropdownMenu = null
    this._firstDropdownAction = null
    this._lastDropdownAction = null
    this._focusTrap = null
    this._activeDropdownActions = []
    this._allowFocusReturn = true
  }

  _setActiveDropdownId() {
    this._activeDropdownId = this._activeTrigger.getAttribute(Selectors.DATA_PARENT)
  }

  _startActiveDropdownEvents() {
    this._activeTrigger.removeEventListener(Events.CLICK, this._handleClick)
    this._activeTrigger.addEventListener(Events.CLICK, this._handleClose)

    layerManager.add({
      events: ["click", "keydown"],
      id: this._activeDropdownId,
      callback: this._handleLayerDismiss,
    })

    this._activeDropdownActions = this._getDropdownActions(
      this._activeDropdownAttr,
      `#${this._activeDropdownMenuId}`
    )

    this._firstDropdownAction = this._activeDropdownActions[0]
    this._lastDropdownAction = this._activeDropdownActions[this._activeDropdownActions.length - 1]

    this._firstDropdownAction.addEventListener(Events.KEYDOWN, this._handleFirstTabClose)
    this._lastDropdownAction.addEventListener(Events.KEYDOWN, this._handleLastTabClose)

    this._activeDropdownActions.forEach(action => {
      action.setAttribute(Selectors.TABINDEX, "0")
      action.addEventListener(Events.CLICK, this._handleClose)
    })

    const containerSelector = `${this._activeDropdownAttr} > ${this._dropdownMenuClassName}`

    if (this._focusTrap) {
      this._focusTrap.stop()
    }

    this._focusTrap = createFocusTrap(containerSelector, { useArrows: true })
    this._focusTrap.start()
  }

  _setVisibleState() {
    this._activeTrigger.setAttribute(Selectors.ARIA_EXPANDED, "true")
    this._activeDropdown.setAttribute(Selectors.DATA_VISIBLE, "true")
  }

  _setActiveDropdownMenu() {
    this._activeDropdownMenuId = this._activeTrigger.getAttribute(Selectors.DATA_TARGET)
    this._activeDropdownMenu = this._activeDropdown.querySelector(`#${this._activeDropdownMenuId}`)
  }

  _setActiveDropdown() {
    this._activeDropdownAttr = `[${Selectors.DATA_DROPDOWN}="${this._activeDropdownId}"]`
    this._activeDropdown = document.querySelector(this._activeDropdownAttr)
  }

  _closeOpenDropdowns(event) {
    if (!this._activeTrigger) return

    this._allowFocusReturn = false
    this._handleClose(event)
    this._allowFocusReturn = true
  }

  _handleLayerDismiss(event) {
    if (event.type === "click") {
      this._handleOffMenuClick(event)
    } else if (event.type === "keydown") {
      this._handleEscapeKeyPress(event)
    }
  }

  _handleFirstTabClose(event) {
    const shiftKey = event.which === KeyCodes.SHIFT || event.shiftKey
    const tabKey = event.which === KeyCodes.TAB

    if (shiftKey && tabKey) {
      this._handleClose(event)
    }
  }

  _handleLastTabClose(event) {
    const shiftKey = event.which === KeyCodes.SHIFT || event.shiftKey
    const tabKey = event.which === KeyCodes.TAB

    if (tabKey && !shiftKey) {
      this._handleClose(event)
    }
  }

  _handleArrowKeyPress(event) {
    if (event.which === KeyCodes.ARROW_UP || event.which === KeyCodes.ARROW_DOWN) {
      this._handleClick(event, event.which)
    }
  }

  _handleEscapeKeyPress(event) {
    if (event.which === KeyCodes.ESCAPE) {
      this._handleClose(event)
    }
  }

  _handleOffMenuClick(event) {
    if (event.target !== this._activeTrigger && event.target !== this._activeDropdownMenu) {
      this._handleClose(event)
    }
  }

  _handleReturnFocus() {
    if (!this._activeTrigger) return
    focusOnce(this._activeTrigger)
  }

  _getDropdownActions(dropdownAttr, menuId) {
    return queryAll(
      `${dropdownAttr} > ${menuId} > li > a, ${dropdownAttr} > ${menuId} > li > button`
    )
  }
}
