// pages/api/products.js
import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      if (id) {
        const productRef = doc(db, "products", id);
        const docSnap = await getDoc(productRef);
        if (docSnap.exists()) {
          res.status(200).json({ id: docSnap.id, ...docSnap.data() });
        } else {
          res.status(404).json({ message: "Producto no encontrado" });
        }
      } else {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(products);
      }
    } else if (req.method === "POST") {
      const { name, size, tags, description, image } = req.body;

      // Validar campos requeridos
      if (!name || !size || !tags || !description || !image) {
        return res.status(400).json({ message: "Todos los campos son obligatorios, incluida la URL de la imagen" });
      }

      const newProduct = { name, size, tags, description, image };
      const docRef = await addDoc(collection(db, "products"), newProduct);

      res.status(201).json({ message: "Producto creado", id: docRef.id });
    } else if (req.method === "PUT" && id) {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, req.body);
      res.status(200).json({ message: "Producto actualizado" });
    } else if (req.method === "DELETE" && id) {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      res.status(200).json({ message: "Producto eliminado" });
    } else {
      res.status(405).json({ message: "Método no permitido" });
    }
  } catch (error) {
    console.error("Error en la operación:", error);
    res.status(500).json({ message: "Error en la operación", details: error.message });
  }
}
