import * as React from "react"
import {Text, TextInput, TouchableOpacity, View} from "react-native"
import { useSignUp } from "@clerk/clerk-expo"
import {Link, useRouter} from "expo-router"
import { useState } from "react"
import { styles } from "@/assets/styles/auth.styles.js"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/assets/styles/colors.js"
import { Image } from "expo-image"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default function SignUpScreen() {
    // from Clerk; setActive = saying that user has done verification for sign-up
    const {isLoaded, signUp, setActive} = useSignUp()
    const router = useRouter();
    
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState("") // verification code after press "signup" for the first time
    const [error, setError] = useState("")
    
    // Handle submission of sign-up form
    const onSignUpPress = async() => {
        // Start signup process using email and password provided
        try {
            await signUp.create({emailAddress, password})
            // sign-up strategy: send a VERIFICATION CODE PER EMAIL to confirm right after
            await signUp.prepareEmailAddressVerification({ strategy: "email_code"})
            // display another "verification-form"
            setPendingVerification(true);
        } catch(err) {
            if (err.errors?.[0]?.code === "form_identifier_exists") {
                setError("That email address is already in use. Please try another.")
            } else {
                setError("An error occured. Please try again.")
            }
            console.log(err)
        }
    }
    
    // Handle submission of verification code
    const onVerifyPress = async () => {
        if (!isLoaded) return; 
        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({code});
            // set active status of user (keep a login session running) and redirect to home page
            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace("/");
            } else { // enter wrong code to verify
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch(err) {
            console.error(JSON.stringify(err, null, 2))
        }
    };
    
    // When we have the "verification-page" after "sign-up" press
    if (pendingVerification){
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Verify your email</Text>
                
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={()=>setError("")}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ): null}
                
                <TextInput 
                    style={[styles.verificationInput, error && styles.errorInput]} // add more styles if there is error i.e. red outer border
                    value={code}
                    placeholder="Enter your verification code"
                    onChangeText={(code)=>setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
                    <Text  style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </ View>
        )
    }
    
    return (
        <KeyboardAwareScrollView 
            style={{flex: 1}} 
            contentContainerStyle={{flexGrow: 1}}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={20}
        >
            <View style={styles.container}>
                <Image source={require("../../../assets/images/revenue-i2.png")} style={styles.illustration}/>
                <Text style={styles.title}>Create Account</Text>
                
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={()=>setError("")}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}
                
                <TextInput 
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholderTextColor="#9A8478"
                    placeholder="Enter email"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput 
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9A8478"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={()=>router.back()}>
                        <Text style={styles.linkText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}