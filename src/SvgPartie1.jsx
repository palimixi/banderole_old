import React from 'react';

function SvgPartie1(props) {
  return (
    <svg className="svg-partie-1" width="400" height="25" viewBox="0 0 400 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10C0 4.47715 4.47715 0 10 0H390C395.523 0 400 4.47715 400 10V25H0V10Z" fill="#F2F2F2"/>
      <circle className="red-circle" cx="374" cy="12.5" r="6" />
      <circle className="yellow-circle" cx="354" cy="12.5" r="6" />
      <circle className="green-circle" cx="334" cy="12.5" r="6" />
      <circle className="svg-stroke" />
      <circle cx="354" cy="12.5" />
      <circle cx="334" cy="12.5" />
    </svg>
  );
}

export default SvgPartie1;
