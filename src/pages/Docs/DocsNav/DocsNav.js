import React, { Component } from 'react';
import './DocsNav.scss';

import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'react-feather';

export default class DocsNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuIsOpen: true,
      menuClasses: '',
      buttonClasses: '',
      buttonText: ''
    }
    this.checkWidth = this.checkWidth.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.checkWidth();
    window.addEventListener('resize', this.checkWidth);
    this.setState({
      menuIsOpen: true,
      menuClasses: 'xsmall-order-2 xsmall-12 columns docs-nav-menu',
      buttonClasses: 'show-on-xsmall hide-on-xlarge',
      buttonText: 'Hide Menu'
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWidth);
  }

  checkWidth() {
    if (window.outerWidth > 1199) {
      this.setState({
        menuIsOpen: true,
        menuClasses: 'xsmall-order-2 xsmall-12 columns docs-nav-menu',
        buttonClasses: 'show-on-xsmall hide-on-xlarge',
        buttonText: 'Hide Menu'
      })
    }
  }

  handleClick(e) {
    e.preventDefault();
    let hideClass = '';
    let label = '';
    let rotateClass = '';

    if (this.state.menuIsOpen === true) {
      hideClass = 'is-not-displayed';
      label = 'Show Menu';
      rotateClass = 'rotate-180';
    } else {
      label = 'Hide Menu';
    }

    this.setState({
      menuIsOpen: !this.state.menuIsOpen,
      menuClasses: `xsmall-order-2 xsmall-12 docs-nav-menu columns ${hideClass}`,
      buttonClasses: `show-on-xsmall hide-on-xlarge ${rotateClass}`,
      buttonText: label
    });
  }

  render() {
    return (
      <div className="docs-nav-wrapper row">
        <div className="docs-nav-expand show-on-xsmall hide-on-xlarge">
          <a
            onClick={this.handleClick}
            className={this.state.buttonClasses}
            href="#">
              {this.state.buttonText} <ChevronDown size={20} />
          </a>
        </div>

        <nav className={this.state.menuClasses}>
          <h3 className="paragraph"><strong>Explore Monolith</strong></h3>
          <h4 className="paragraph">Getting Started</h4>
          <ul>
            <li><NavLink activeClassName="selected" to='/docs/overview'>Overview</NavLink></li>
            <li><NavLink activeClassName="selected" to='/docs/download'>Download</NavLink></li>
            <li><NavLink activeClassName="selected" to='/docs/configuration'>Configuration</NavLink></li>
          </ul>
          <h4 className="paragraph">Components</h4>
          <ul>
            <li><NavLink activeClassName="selected" to='/docs/grid'>Grid</NavLink></li>
            <li><NavLink activeClassName="selected" to='/docs/typography'>Typography</NavLink></li>
            <li><NavLink activeClassName="selected" to='/docs/buttons'>Buttons</NavLink></li>
            <li><NavLink activeClassName="selected" to='/docs/forms'>Forms</NavLink></li>
          </ul>
          <h4 className="paragraph">Helpers</h4>
          <ul>
            <li><NavLink activeClassName="selected" to='/docs/classes'>Classes</NavLink></li>
            <li><NavLink activeClassName="selected" to='/docs/mixins'>Mixins</NavLink></li>
            <li><NavLink activeClassName="selected" to='/docs/functions'>Functions</NavLink></li>
          </ul>
        </nav>
      </div>
    )
  }
}