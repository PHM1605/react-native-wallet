// to use signOut() function from Clerk
import {useAuth} from "@clerk/clerk-expo";
import { Text, TouchableOpacity } from "react-native"

export const SignOutButton = () => {
    const {signOut, isLoaded} = useAuth();
    if (!isLoaded) return null;
    
    const handleSignOut = async () => {
        try {
            await signOut(); // redirect to "sign-in" page (read (root)=>_layout.jsx)
        } catch(err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }
    
    return (
        <TouchableOpacity onPress={handleSignOut}>
            <Text>Sign out</Text>
        </TouchableOpacity>
    )
}