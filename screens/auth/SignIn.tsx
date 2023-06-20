import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Background from "../../src/components/Background";
import Logo from "../../src/components/Logo";
import Header from "../../src/components/Header";
import Button from "../../src/components/Button";
import BackButton from "../../src/components/BackButton";
import { theme } from "../../src/core/theme";
import { Navigation } from "../../src/types";
import OTP from "../../src/core/OTP";
import { useUserAuth } from "../../context/UserAuthContext";

type Props = {
  navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
  const { user } = useUserAuth();

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("HomeScreen")} />

      <Logo />

      <Header>Create Account</Header>
      <OTP />
      <Text style={styles.separator}>
        ____________________ ó ____________________
      </Text>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("SignInWithEmail")}
        style={styles.button}
      >
        Registrarme con Email y Password
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  separator: {
    color: theme.colors.backdrop,
  },
});

export default memo(RegisterScreen);
