// Homepage: decides "SignedIn" or "SignedOut" screen to be shown to user
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"; // screens from Clerk
import { Link } from "expo-router";
import { Text, View } from "react-native"
import { SignOutButton } from "../../components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect } from "react";

export default function Page() {
    // status of current user
    const {user} = useUser();
    // use transaction hook to fetch data
    const {transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user.id);
    
    useEffect(() => {
        loadData()
    }, [])
    
    console.log("transactions: ", transactions)
    console.log("summary: ", summary)
    console.log("userId:", user.id)
    
    return (
        <View>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <Link href="/(auth)/sign-in">
                    <Text>Sign in</Text>
                </Link>
                <Link href="/(auth)/sign-up">
                    <Text>Sign up</Text>
                </Link>
            </SignedOut>
        </View>
    )
}