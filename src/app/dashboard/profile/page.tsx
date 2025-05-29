// "use client";

// import { useState, useEffect } from "react";
// import { auth, db } from "@/lib/utils";
// import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Edit2, Check, X } from "lucide-react";

// interface UserData {
//   name: string;
//   email: string;
// }

// export default function Profile() {
//   const [loadingField, setLoadingField] = useState<string | null>(null);
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [fieldValue, setFieldValue] = useState("");
//   const [userAuth, setUserAuth] = useState(auth.currentUser);
//   const [userData, setUserData] = useState<UserData>({ name: "", email: "" });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUserAuth(currentUser);
//       if (currentUser) {
//         // Fetch user details from Firestore
//         const userDoc = doc(db, "users", currentUser.uid);
//         const snapshot = await getDoc(userDoc);
//         if (snapshot.exists()) {
//           const data = snapshot.data();
//           setUserData({
//             name: data.name || "",
//             email: currentUser.email || "",
//           });
//         } else {
//           setUserData({ name: "", email: currentUser.email || "" });
//         }
//       }
//     });
//     return unsubscribe;
//   }, []);

//   const startEdit = (field: string) => {
//     if (!userAuth) return;
//     setEditingField(field);
//     setFieldValue(field === "name" ? userData.name : field === "email" ? userData.email : "");
//   };

//   const cancelEdit = () => {
//     setEditingField(null);
//     setFieldValue("");
//   };

//   const saveField = async () => {
//     if (!userAuth || !editingField) return;
//     setLoadingField(editingField);
//     try {
//       // Update Firestore for name
//       if (editingField === "name" && fieldValue !== userData.name) {
//         const userDoc = doc(db, "users", userAuth.uid);
//         await updateDoc(userDoc, { name: fieldValue });
//         setUserData(prev => ({ ...prev, name: fieldValue }));
//       }
//       // Update email in Auth and Firestore
//       if (editingField === "email" && fieldValue !== userData.email) {
//         await updateEmail(userAuth, fieldValue);
//         const userDoc = doc(db, "users", userAuth.uid);
//         await updateDoc(userDoc, { email: fieldValue });
//         setUserData(prev => ({ ...prev, email: fieldValue }));
//       }
//       // Update password in Auth
//       if (editingField === "password" && fieldValue) {
//         await updatePassword(userAuth, fieldValue);
//       }
//       alert("Field updated successfully!");
//     } catch (error: any) {
//       console.error(error);
//       alert(error.message || "Update failed.");
//     } finally {
//       setLoadingField(null);
//       setEditingField(null);
//       setFieldValue("");
//     }
//   };

//   const renderField = (label: string, fieldKey: string, value: string) => (
//     <div className="flex items-center justify-between py-2 border-b">
//       <div className="flex-1">
//         <Label className="text-sm font-medium">{label}</Label>
//         {!editingField || editingField !== fieldKey ? (
//           <p className="mt-1 text-base">{value || "—"}</p>
//         ) : (
//           <Input
//             id={fieldKey}
//             type={fieldKey === "password" ? "password" : "text"}
//             value={fieldValue}
//             onChange={(e) => setFieldValue(e.target.value)}
//           />
//         )}
//       </div>
//       <div className="flex items-center gap-2 ml-4">
//         {!editingField || editingField !== fieldKey ? (
//           <button
//             type="button"
//             onClick={() => startEdit(fieldKey)}
//             className="p-1 rounded hover:bg-muted"
//             aria-label={`Edit ${label}`}>
//             <Edit2 className="h-5 w-5" />
//           </button>
//         ) : (
//           <>
//             <button
//               type="button"
//               onClick={saveField}
//               disabled={loadingField === fieldKey}
//               className="p-1 rounded hover:bg-muted"
//               aria-label="Save">
//               <Check className="h-5 w-5" />
//             </button>
//             <button
//               type="button"
//               onClick={cancelEdit}
//               className="p-1 rounded hover:bg-muted"
//               aria-label="Cancel">
//               <X className="h-5 w-5" />
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="mx-auto max-w-md space-y-6">
//       <h1 className="text-2xl font-bold">Profile</h1>
//       <Card>
//         <CardHeader>
//           <CardTitle>User Details</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {renderField("Name", "name", userData.name)}
//           {renderField("Email", "email", userData.email)}
//           {renderField("Password", "password", "••••••••")}
//         </CardContent>
//         <CardFooter>
//           <p className="text-xs text-muted-foreground">
//             Click the edit icon to change each field individually.
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }