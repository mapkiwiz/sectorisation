import React from 'react';
import {Link} from 'react-router';

export function MenuLink(props, context) {

  return (
    <Link to="/" className="pull-right">
      <span className="glyphicon glyphicon-menu-hamburger"></span>
    </Link>
  );

}
