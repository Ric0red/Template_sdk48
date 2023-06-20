import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  updateProfile,
  updatePhoneNumber,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
// Inicializar Firebase
import { auth, db, storage } from "../../config/firebase";

// Configuración de Firebase
const firebaseConfig = {
  // Tu configuración de Firebase aquí
};

// Inicializar Firebase
//const app = initializeApp(firebaseConfig);
//const db = getFirestore(app);
//const auth = getAuth();

// Create a Recaptcha verifier instance
const appVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);

// Crear una colección de datos
const dataCollection = collection(db, "data");

// Función para crear un nuevo documento en la colección
const createData = async (data) => {
  try {
    const docRef = await addDoc(dataCollection, data);
    console.log("Documento creado con ID: ", docRef.id);
  } catch (error) {
    console.error("Error al crear el documento: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};

// Función para leer todos los documentos en la colección
const readData = async () => {
  try {
    const querySnapshot = await getDocs(dataCollection);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  } catch (error) {
    console.error("Error al leer los documentos: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};

// Función para actualizar un documento en la colección
const updateData = async (id, data) => {
  try {
    const docRef = doc(db, "data", id);
    await updateDoc(docRef, data);
    console.log("Documento actualizado");
  } catch (error) {
    console.error("Error al actualizar el documento: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};

// Función para eliminar un documento en la colección
const deleteData = async (id) => {
  try {
    const docRef = doc(db, "data", id);
    await deleteDoc(docRef);
    console.log("Documento eliminado");
  } catch (error) {
    console.error("Error al eliminar el documento: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};

// Función para registrar un nuevo usuario con correo electrónico y contraseña
const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // actualizando Username
    await updateProfile(user, { displayName: name });
    console.log("Usuario registrado: ", user.uid);
  } catch (error) {
    console.error("Error al registrar el usuario: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};

// Función para iniciar sesión con correo electrónico y contraseña
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Usuario inició sesión: ", user.uid);
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};

// Función para enviar un correo electrónico de restablecimiento de contraseña
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Correo electrónico de restablecimiento de contraseña enviado");
  } catch (error) {
    console.error(
      "Error al enviar el correo electrónico de restablecimiento de contraseña: ",
      error
    );
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};
// Funcion de registro telefonico
const registerUserWithPhoneNumber = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    // Ask user to enter the verification code sent to their phone
    const code = window.prompt(
      "Enter the verification code sent to your phone"
    );
    const userCredential = await confirmationResult.confirm(code);
    const user = userCredential.user;
    console.log("Usuario registrado: ", user.uid);
  } catch (error) {
    console.error("Error al registrar el usuario: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};
// Funcion para actualizar el numero telefonico
const updatePhoneNumber = async (user, phoneNumber) => {
  try {
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(
      phoneNumber,
      appVerifier
    );
    // Ask user to enter the verification code sent to their phone
    const code = window.prompt(
      "Enter the verification code sent to your phone"
    );
    const credential = PhoneAuthProvider.credential(verificationId, code);
    await updatePhoneNumber(user, credential);
    console.log("Número de teléfono actualizado");
  } catch (error) {
    console.error("Error al actualizar el número de teléfono: ", error);
    // Traducir el mensaje de error al español
    const errorMessage = translateErrorMessage(error.code);
    console.error(errorMessage);
  }
};
