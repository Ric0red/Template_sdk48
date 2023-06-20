import { signInWithPhoneNumber } from "firebase/auth";
import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { HelperText, Menu } from "react-native-paper";
import Button from "../../src/components/Button";
import TextInput from "../../src/components/TextInput";
import { useUserAuth } from "../../context/UserAuthContext";
import * as yup from "yup";
import { theme } from "./theme";

const phoneSchema = yup
  .string()
  .matches(/^\d+$/, "El número de teléfono solo debe contener números")
  .min(10, "El número de teléfono debe tener al menos 10 dígitos")
  .required("El número de teléfono es obligatorio");

const codeSchema = yup
  .string()
  .matches(/^\d+$/, "El código de verificación solo debe contener números")
  .max(6, "El código de verificación no debe tener más de 6 dígitos")
  .required("El código de verificación es obligatorio");

const countries = [
  { name: "Estados Unidos", flag: "🇺🇸", code: "+1" },
  { name: "México", flag: "🇲🇽", code: "+52" },
  { name: "España", flag: "🇪🇸", code: "+34" },
  { name: "Perú", flag: "🇵🇪", code: "+51" },
  { name: "Argentina", flag: "🇦🇷", code: "+54" },
  { name: "Venezuela", flag: "🇻🇪", code: "+58" },
  { name: "Colombia", flag: "🇨🇴", code: "+57" },
  { name: "Chile", flag: "🇨🇱", code: "+56" },
  { name: "Brasil", flag: "🇧🇷", code: "+55" },
];

const RegisterUserWithPhoneNumber = ({ auth }) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationId, setVerificationId] = React.useState(null);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [codeError, setCodeError] = React.useState("");
  const [countryCode, setCountryCode] = React.useState(countries[5].code);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [countdown, setCountdown] = React.useState(30);
  const [resendCount, setResendCount] = React.useState(0);

  React.useEffect(() => {
    if (verificationId && countdown > 0) {
      const timeoutId = setTimeout(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [verificationId, countdown]);

  const handleSendCode = async () => {
    try {
      await phoneSchema.validate(phoneNumber);
      setPhoneError("");
      const fullPhoneNumber = countryCode + phoneNumber;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber
      );
      setVerificationId(confirmationResult.verificationId);
      setCountdown(30);
    } catch (error) {
      if (error.name === "ValidationError") {
        setPhoneError(error.message);
      } else {
        console.error("Error al enviar el código de verificación: ", error);
        // Traducir el mensaje de error al español
        const errorMessage = translateErrorMessage(error.code);
        console.error(errorMessage);
      }
    }
  };

  const handleResendCode = async () => {
    try {
      await phoneSchema.validate(phoneNumber);
      setPhoneError("");
      const fullPhoneNumber = countryCode + phoneNumber;
      await signInWithPhoneNumber(auth, fullPhoneNumber);
      if (resendCount === 0) {
        setCountdown(60); // default
      } else if (resendCount === 1) {
        setCountdown(120); // Aumentar a 2 minutos
      } else if (resendCount === 2) {
        setCountdown(300); // Aumentar a 5 minutos
      } else {
        setCountdown(30); // Volver a treinta segundos
      }
      setResendCount((resendCount) => resendCount + 1);
    } catch (error) {
      if (error.name === "ValidationError") {
        setPhoneError(error.message);
      } else {
        console.error("Error al reenviar el código de verificación: ", error);
        // Traducir el mensaje de error al español
        const errorMessage = translateErrorMessage(error.code);
        console.error(errorMessage);
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      await codeSchema.validate(verificationCode);
      setCodeError("");
      const credential = await auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const userCredential = await auth.signInWithCredential(credential);
      if (userCredential.additionalUserInfo.isNewUser) {
        console.log("Usuario nuevo registrado");
      } else {
        console.log("Usuario existente inició sesión");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        setCodeError(error.message);
      } else {
        console.error("Error al verificar el código: ", error);
        // Traducir el mensaje de error al español
        const errorMessage = translateErrorMessage(error.code);
        console.error(errorMessage);
      }
    }
  };

  return (
    <>
      {!verificationId ? (
        <>
          <View style={styles.row}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button onPress={() => setMenuVisible(true)}>
                  {countries.find((country) => country.code === countryCode)
                    .flag +
                    "  " +
                    countryCode}
                </Button>
              }
            >
              {countries.map((country) => (
                <Menu.Item
                  key={country.code}
                  style={styles.bg}
                  title={`${country.code} ${country.flag} ${country.name}`}
                  onPress={() => {
                    setCountryCode(country.code);
                    setMenuVisible(false);
                  }}
                />
              ))}
            </Menu>
            <View style={styles.input}>
              <TextInput
                label="Ingresa tu número de teléfono"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          <HelperText type="error" visible={!!phoneError}>
            {phoneError}
          </HelperText>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSendCode}
          >
            Enviar código de verificación
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="Ingresa el código de verificación"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />
          <View style={styles.row}>
            <Text>{countdown}</Text>
            {countdown === 0 && (
              <Button mode="outlined" onPress={handleResendCode}>
                Reenviar código
              </Button>
            )}
          </View>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleVerifyCode}
          >
            Verificar código
          </Button>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  button: {
    marginTop: 24,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  bg: {
    backgroundColor: theme.colors.surface,
  },
});

export default RegisterUserWithPhoneNumber;
