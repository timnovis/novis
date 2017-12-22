import React from 'react';

class Layout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <header>
          <h1 class="logo">
            <a href="/">Tim Novis</a>
          </h1>
          <p>JavaScript Developer & UI Designer</p>
        </header>
        <main>{this.props.children}</main>
        <footer>
          &copy; Tim Novis
          <nav>
            <a href="https://github.com/timnovis">github</a>
            <a href="https://twitter.com/timnovis">twitter</a>
            <a href="https://instagram.com/timnovis">instagram</a>
          </nav>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;
