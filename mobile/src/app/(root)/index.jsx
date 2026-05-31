// Homepage: decides "SignedIn" or "SignedOut" screen to be shown to user
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"; // screens from Clerk
import { Link, useRouter } from "expo-router";
import { Text, View, Image, TouchableOpacity, FlatList, Alert, RefreshControl } from "react-native"
import { SignOutButton } from "../../components/SignOutButton";
import PageLoader from "../../components/PageLoader";
import { useTransactions } from "../../hooks/useTransactions";
import { useState, useEffect } from "react";
import { styles } from "../../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";

export default function Page() {
    // status of current user
    const {user} = useUser();
    const router = useRouter();
    // use transaction hook to fetch data
    const {transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user.id);
    // when user swipes down to refresh the long Transactions List => load data again from server
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        loadData()
    }, [])
    
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }
    
    const handleDelete = (id) => {
        // asking for confirmation
        Alert.alert("Delete Transaction", "Are you sure you want to delete this transactions?", [
            {text: "Cancel", style: "cancel"},
            {text: "Delete", style: "destructive", onPress: () => deleteTransaction(id)}
        ])
    }
    
    if (isLoading && !refreshing) return <PageLoader />
    
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* HEADER */}
                <View style={styles.header}>
                    {/* LEFT */}
                    <View style={styles.headerLeft}>
                        <Image 
                            source={require("../../../assets/images/logo.png")}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Welcome,</Text>
                            <Text style={styles.usernameText}>
                                {/* phm1605@gmail.com => phm1605 */}
                                {user?.emailAddresses[0]?.emailAddress.split("@")[0] }
                            </Text>
                        </View>
                    </View>
                    {/* RIGHT */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.addButton} onPress={()=>router.push("/create")}>
                            <Ionicons name="add" size={20} color="#FFF" />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <SignOutButton />
                    </View>
                </View>
                {/* BALANCE CARD */}
                <BalanceCard summary={summary} />
                {/* RECENT TRANSACTIONS */}
                <View style={styles.transactionsHeaderContainer}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                </View>
            </View>
            
            {/* LIST OF TRANSACTIONS */}
            {/* FlatList has "lazy" operation - only render ONLY first items on screen */}
            <FlatList 
                style={styles.transactionsList}
                contentContainerStyle={styles.transactionsListContent}
                data={transactions}
                renderItem={(item) => ( 
                    <TransactionItem item={item.item} onDelete={handleDelete}/>
                )}
                ListEmptyComponent={<NoTransactionsFound />}
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
            />
        </View>
    )
}