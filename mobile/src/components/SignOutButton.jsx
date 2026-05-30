// to use signOut() function from Clerk
import {useAuth} from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity } from "react-native"
import { COLORS } from "../../assets/styles/colors";
import { styles } from "../../assets/styles/home.styles";

export const SignOutButton = () => {
    const {signOut, isLoaded} = useAuth();
    if (!isLoaded) return null;
    
    const handleSignOut = async () => {
        // Confirmation first before logout
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: signOut }
        ])
    }
    
    return (
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
    )
}