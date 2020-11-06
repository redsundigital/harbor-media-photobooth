import React from 'react';
import { Link } from 'react-router-dom';

import { Flex } from 'components';

function Home() {
  return (
    <Flex fullscreen center column>
      <span>Home</span>
      <br />
      <Link to="/kiosk">Kiosk</Link>
    </Flex>
  );
}

export default Home;
