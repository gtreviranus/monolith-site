import React from "react"
import Footer from "../Footer"

jest.mock("react-feather/dist/icons/twitter", () => global.simpleMock("Twitter"))
jest.mock("react-feather/dist/icons/github", () => global.simpleMock("Github"))

describe("<Footer />", () => {
  const baseProps = {
    handleRefocusClick: jest.fn(),
    headerRef: {
      current: document.createElement("header"),
    },
  }

  const mountComponent = () => {
    return mount(<Footer {...baseProps} />)
  }

  it("renders", () => {
    // Given
    const wrapper = mountComponent()
    // Then
    expect(wrapper).toMatchSnapshot()
  })

  it("calls handleRefocusClick prop when hidden button is clicked", () => {
    // Given
    const wrapper = mountComponent()
    // When
    wrapper.find(".is-visually-hidden-focusable").simulate("click")
    // Then
    expect(baseProps.handleRefocusClick).toHaveBeenCalledWith(baseProps.headerRef)
  })
})
