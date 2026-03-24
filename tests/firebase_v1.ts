import { START_YEAR } from "@/constants/constants";
import { db, PROGRESS_COLLECTION, TRAINING_COLLECTION, USERS_COLLECTION } from "@/services/firebase";
import { UserProgressDoc } from "@/types/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const docRefV1 = doc(db, USERS_COLLECTION, "user_38AIDv1G1gYzU8kASa0o6BjwsLF", PROGRESS_COLLECTION, `year_${START_YEAR}`);
const docRefV2 = doc(db, USERS_COLLECTION, "user_38AIDv1G1gYzU8kASa0o6BjwsLF", TRAINING_COLLECTION, "pushup", `year_${START_YEAR}`, PROGRESS_COLLECTION);

async function main() {
    console.log("docRefV1:", docRefV1.path);

    const snapshot = await getDoc(docRefV1);

    if (snapshot.exists()) {
        const data = snapshot.data() as UserProgressDoc;
        console.log("Data:", data);
        await setDoc(docRefV2, data, { merge: true });
        console.log('💾 Données sauvegardées dans Firebase');
    } else {
        console.log("Document does not exist");
    }
}

main().catch(console.error);