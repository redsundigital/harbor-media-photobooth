import React from 'react';
import { Link } from 'react-router-dom';

import { Flexbox } from 'components';

function Home() {
  return (
    <Flexbox fullscreen center column>
      <span>Home</span>
      <br />
      <Link to="/camera">Camera</Link>
    </Flexbox>
  );
}

export default Home;
