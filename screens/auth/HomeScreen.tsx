import React, { memo } from 'react';
import Background from '../../src/components/Background';
import Logo from '../../src/components/Logo';
import Header from '../../src/components/Header';
import Button from '../../src/components/Button';
import Paragraph from '../../src/components/Paragraph';
import { Navigation } from '../../src/types';

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => (
  <Background>
    <Logo />
    <Header>Login Template</Header>

    <Paragraph>
      The easiest way to start with your amazing application.
    </Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('LogIn')}>
      Login
    </Button>
    <Button
      mode="outlined"
      onPress={() => navigation.navigate('SignIn')}
    >
      Sign Up
    </Button>
  </Background>
);

export default memo(HomeScreen);
